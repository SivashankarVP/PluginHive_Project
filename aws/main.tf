provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "domain_name" {
  type    = string
  default = "cravego.example.com"
}

# ==========================================
# 1. DYNAMODB TABLES
# ==========================================

resource "aws_dynamodb_table" "users" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "username"

  attribute {
    name = "username"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = "CraveGo"
  }
}

resource "aws_dynamodb_table" "restaurants" {
  name         = "Restaurants"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "N"
  }

  tags = {
    Environment = "production"
    Project     = "CraveGo"
  }
}

resource "aws_dynamodb_table" "menu" {
  name         = "Menu"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "restaurantId"
  range_key    = "id"

  attribute {
    name = "restaurantId"
    type = "N"
  }

  attribute {
    name = "id"
    type = "N"
  }

  tags = {
    Environment = "production"
    Project     = "CraveGo"
  }
}

resource "aws_dynamodb_table" "orders" {
  name         = "Orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "id"

  attribute {
    name = "userId"
    type = "N"
  }

  attribute {
    name = "id"
    type = "N"
  }

  tags = {
    Environment = "production"
    Project     = "CraveGo"
  }
}

# ==========================================
# 2. S3 BUCKET FOR INVOICES & MEDIA
# ==========================================

resource "aws_s3_bucket" "assets" {
  bucket        = "cravego-assets-prod"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "assets_block" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "assets_policy" {
  bucket = aws_s3_bucket.assets.id
  depends_on = [aws_s3_bucket_public_access_block.assets_block]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.assets.arn}/*"
      }
    ]
  })
}

# ==========================================
# 3. FRONTEND S3 WEB HOSTING & CLOUDFRONT CDN
# ==========================================

resource "aws_s3_bucket" "frontend" {
  bucket        = "cravego-frontend-hosting"
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "frontend_hosting" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for CraveGo frontend hosting"
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "CloudFrontReadGetObject"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-Frontend"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Frontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = "production"
    Project     = "CraveGo"
  }
}

# ==========================================
# 4. IAM POLICY FOR BACKEND (EXPRESS APP)
# ==========================================

resource "aws_iam_policy" "backend_access" {
  name        = "CraveGoBackendPolicy"
  description = "IAM policy for CraveGo backend server to access DynamoDB, S3, and SES"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.restaurants.arn,
          aws_dynamodb_table.menu.arn,
          aws_dynamodb_table.orders.arn
        ]
      },
      {
        Effect   = "Allow"
        Action   = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.assets.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "Web address of CraveGo client"
}

output "assets_bucket_name" {
  value       = aws_s3_bucket.assets.id
  description = "S3 bucket for invoice storage"
}

# ==========================================
# 5. SQS & SNS (ORDER PIPELINE)
# ==========================================

resource "aws_sqs_queue" "order_queue" {
  name                      = "cravego-orders-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 0
}

resource "aws_sns_topic" "order_notifications" {
  name = "cravego-order-notifications"
}

# ==========================================
# 6. REDIS (ELASTICACHE)
# ==========================================
# Using default VPC for simplicity in MVP
data "aws_vpc" "default" {
  default = true
}
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "cravego-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# ==========================================
# 7. ECS FARGATE & ALB
# ==========================================

resource "aws_ecr_repository" "backend_repo" {
  name                 = "cravego-backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecs_cluster" "main" {
  name = "cravego-cluster"
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "cravego-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  
  container_definitions = jsonencode([
    {
      name      = "cravego-backend"
      image     = "${aws_ecr_repository.backend_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        { name = "USE_AWS_MOCK", value = "false" },
        { name = "SQS_QUEUE_URL", value = aws_sqs_queue.order_queue.url }
      ]
    }
  ])
}

output "sqs_queue_url" {
  value = aws_sqs_queue.order_queue.url
}
