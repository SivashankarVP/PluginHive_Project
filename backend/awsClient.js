import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";

// Load configuration
const useMock = process.env.USE_AWS_MOCK !== "false"; // Default to mock for local dev
const region = process.env.AWS_REGION || "us-east-1";

let dynamoDocClient = null;
let s3Client = null;
let sesClient = null;

if (!useMock) {
  const config = {
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };
  const dbClient = new DynamoDBClient(config);
  dynamoDocClient = DynamoDBDocumentClient.from(dbClient);
  s3Client = new S3Client(config);
  sesClient = new SESClient(config);
  console.log("AWS Clients Initialized in Production/Cloud Mode");
} else {
  console.log("AWS Clients Initialized in Local/Mock Mode");
}

// Local mock database helpers (db.json file filesystem fallback)
const dbPath = path.resolve("db.json");
const readLocalDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (error) {
    console.error("Error reading mock database:", error);
    return { users: [], restaurants: [], menu: [], orders: [] };
  }
};

const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing mock database:", error);
  }
};

// Interface wrapper to handle both real AWS and local fallback transparently
export const db = {
  get: async ({ TableName, Key }) => {
    if (!useMock) {
      const command = new GetCommand({ TableName, Key });
      const result = await dynamoDocClient.send(command);
      return result.Item;
    } else {
      const localData = readLocalDb();
      const collectionName = TableName.toLowerCase();
      const list = localData[collectionName] || [];
      return list.find((item) => {
        return Object.keys(Key).every((k) => String(item[k]) === String(Key[k]));
      });
    }
  },

  put: async ({ TableName, Item }) => {
    if (!useMock) {
      const command = new PutCommand({ TableName, Item });
      await dynamoDocClient.send(command);
      return Item;
    } else {
      const localData = readLocalDb();
      const collectionName = TableName.toLowerCase();
      if (!localData[collectionName]) {
        localData[collectionName] = [];
      }
      // Replace if existing key matches, otherwise append
      const keyName = collectionName === "users" ? "username" : "id";
      const index = localData[collectionName].findIndex(
        (item) => String(item[keyName]) === String(Item[keyName])
      );
      if (index > -1) {
        localData[collectionName][index] = Item;
      } else {
        localData[collectionName].push(Item);
      }
      writeLocalDb(localData);
      return Item;
    }
  },

  scan: async ({ TableName }) => {
    if (!useMock) {
      const command = new ScanCommand({ TableName });
      const result = await dynamoDocClient.send(command);
      return result.Items;
    } else {
      const localData = readLocalDb();
      const collectionName = TableName.toLowerCase();
      return localData[collectionName] || [];
    }
  },

  query: async ({ TableName, KeyConditionExpression, ExpressionAttributeValues }) => {
    if (!useMock) {
      const command = new QueryCommand({
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      });
      const result = await dynamoDocClient.send(command);
      return result.Items;
    } else {
      const localData = readLocalDb();
      const collectionName = TableName.toLowerCase();
      const list = localData[collectionName] || [];
      
      // Basic query mapping for local mock
      if (KeyConditionExpression.includes("restaurantId")) {
        const restId = ExpressionAttributeValues[":restaurantId"];
        return list.filter((item) => String(item.restaurantId) === String(restId));
      }
      if (KeyConditionExpression.includes("userId")) {
        const uId = ExpressionAttributeValues[":userId"];
        return list.filter((item) => String(item.userId) === String(uId));
      }
      return list;
    }
  },
};

export const s3 = {
  uploadInvoice: async (orderId, invoiceContent) => {
    const key = `invoices/order-${orderId}.pdf`;
    if (!useMock) {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET || "cravego-invoices",
        Key: key,
        Body: Buffer.from(invoiceContent),
        ContentType: "application/pdf",
      });
      await s3Client.send(command);
      console.log(`Successfully uploaded invoice ${key} to S3`);
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
    } else {
      console.log(`[AWS S3 MOCK] Invoice uploaded successfully to mock S3 bucket. Key: ${key}`);
      return `https://mock-s3-bucket.s3.amazonaws.com/${key}`;
    }
  },
};

export const ses = {
  sendEmail: async (toAddress, subject, bodyHtml) => {
    if (!useMock) {
      const command = new SendEmailCommand({
        Source: process.env.SES_SENDER_EMAIL || "orders@cravego.com",
        Destination: {
          ToAddresses: [toAddress],
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: bodyHtml },
          },
        },
      });
      await sesClient.send(command);
      console.log(`SES Order Notification sent to ${toAddress}`);
    } else {
      console.log(`[AWS SES MOCK] Order Notification Email sent to ${toAddress}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content:\n${bodyHtml}`);
    }
  },
};
