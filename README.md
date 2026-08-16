# 🍔 CraveGo — Full-Stack Food Ordering Platform with AWS Cloud

> **Built for the PluginHive React.js + Node.js + AWS Developer Interview**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js)](https://nodejs.org/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazon-aws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-ECS%2FFargate-2496ED?logo=docker)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/Infrastructure-Terraform-7B42BC?logo=terraform)](https://www.terraform.io/)

---

**CraveGo** is an enterprise-grade, multi-tier food delivery application that demonstrates real-world usage of **React.js**, **Node.js**, and a full suite of **AWS cloud services**. The entire cloud infrastructure is defined as code using **Terraform**.

---

## 🌐 Architecture Overview

```
User Browser
    │
    ▼
CloudFront CDN  ──────────────────────────────────────────
    │                                                     │
    ▼                                                     ▼
S3 (React Frontend)              ALB (Application Load Balancer)
                                          │
                                          ▼
                              ECS Fargate (Node.js API)
                             /           |            \
                            ▼            ▼             ▼
                        DynamoDB    ElastiCache    SQS Queue
                                     (Redis)          │
                                                       ▼
                                                 SNS Topic
                                                  (SMS/Email)
                                                       │
                                                       ▼
                                                   SES Email
```

---

## ☁️ AWS Services Used

| Service | Purpose |
|---|---|
| **DynamoDB** | Primary NoSQL database for users, restaurants, menus, and orders |
| **S3** | Hosts the compiled React frontend + stores order receipt files |
| **CloudFront** | CDN for fast global delivery and HTTPS for the React app |
| **ElastiCache (Redis)** | Caches restaurant menus for 5 minutes (cache-aside pattern) |
| **SQS** | Order events pushed to queue on checkout for async processing |
| **SNS** | Sends SMS/push notifications when an order is confirmed |
| **SES** | Sends HTML order confirmation emails |
| **ECS / Fargate** | Runs the Dockerized Node.js API as serverless containers |
| **ECR** | Stores the Docker image for the backend |
| **IAM** | Least-privilege policy for the backend to access only the resources it needs |
| **CloudWatch** | Structured JSON logs emitted by the backend for monitoring & alerting |
| **Terraform** | All of the above is provisioned as Infrastructure as Code |

---

## 🌟 Application Features

- 🤖 **AI Food Assistant Chatbot** — Intent-matching NLP engine for FAQs, promos, and live order queries
- 🎨 **Dynamic Multi-Theme Switching** — Real-time UI morphing between Burger, Pizza, and Fanta moods
- 💎 **Glassmorphism UI** — Frosted glass effects built from scratch in Vanilla CSS3
- 🔒 **JWT Authentication** — Secure login, route guards, and user-specific order isolation
- 🔔 **Smart Toast Notifications** — Non-blocking animated notifications for all actions
- ✨ **GSAP Micro-Animations** — Fluid GreenSock animations and particle effects
- 📦 **Redis Caching** — Cache-hit / cache-miss logs visible in the terminal during demo
- 📬 **SQS Order Pipeline** — Every order is pushed to SQS, mimicking a real production event-driven flow
- 📊 **CloudWatch Logging** — Every API request logged as structured JSON for monitoring

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, JavaScript ES6+, Vanilla CSS3, GSAP |
| **Backend** | Node.js, Express.js, JWT, AWS SDK v3 |
| **Database** | Amazon DynamoDB (+ local `db.json` mock for offline dev) |
| **Cache** | Amazon ElastiCache Redis (+ in-memory mock for offline dev) |
| **Messaging** | Amazon SQS + SNS |
| **Email** | Amazon SES |
| **Hosting** | S3 + CloudFront (Frontend), ECS Fargate + ALB (Backend) |
| **IaC** | Terraform |
| **Containers** | Docker |

---

## ⚡ Getting Started (Local Development)

The project has a **mock mode** for running 100% locally without any AWS account needed.

### 1. Clone the repository
```bash
git clone https://github.com/SivashankarVP/PluginHive_Project.git
cd PluginHive_Project
```

### 2. Start the Backend
```bash
cd backend
npm install
# USE_AWS_MOCK=true is the default — no AWS credentials needed
npm start
```

Backend runs at **http://localhost:5000**

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 4. Test the Health Endpoint
```bash
curl http://localhost:5000/health
```
Response shows all AWS service statuses:
```json
{
  "status": "healthy",
  "environment": "local-mock",
  "services": {
    "dynamodb": "mock",
    "s3": "mock",
    "redis": "in-memory-mock",
    "sqs": "mock",
    "sns": "mock"
  }
}
```

---

## ☁️ AWS Deployment

### Prerequisites
- AWS Account with credentials configured (`aws configure`)
- Terraform installed
- Docker installed

### 1. Provision Infrastructure
```bash
cd aws
terraform init
terraform apply
```

### 2. Build & Push Docker Image
```bash
cd backend
docker build -t cravego-backend .
# Tag and push to ECR (replace ACCOUNT_ID and REGION)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker tag cravego-backend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cravego-backend:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cravego-backend:latest
```

### 3. Switch to Production Mode
In `backend/.env`:
```env
USE_AWS_MOCK=false
AWS_ACCESS_KEY_ID=your_real_key
AWS_SECRET_ACCESS_KEY=your_real_secret
SQS_QUEUE_URL=<output from terraform>
REDIS_URL=<elasticache endpoint from terraform>
```

---

## 🗂️ Project Structure

```
CraveGo/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # Home, Restaurant, Menu, Cart, Checkout, Orders
│       ├── components/# Navbar, Chatbot, ParticlesBackground
│       └── context/   # AuthContext, CartContext
│
├── backend/           # Node.js + Express API
│   ├── server.js      # Entry point + CloudWatch-style logging
│   ├── awsClient.js   # Unified client for DynamoDB, S3, SES, SQS, SNS, Redis
│   ├── auth.js        # JWT authentication
│   ├── orderController.js    # Order placement → S3 → SQS → SES
│   ├── restaurantController.js  # Restaurants & menus with Redis caching
│   ├── db.json        # Local mock database (15 restaurants + menu items)
│   └── Dockerfile     # For ECS Fargate deployment
│
└── aws/
    └── main.tf        # Terraform IaC for all AWS resources
```

---

## 📜 License

MIT License — Developed with ❤️ by **Sivashankar**