import { db, redisClient } from "./awsClient.js";

const CACHE_TTL_SECONDS = 300; // 5 minutes

export const getRestaurants = async (req, res) => {
  const cacheKey = "restaurants:all";
  try {
    // 1. Try Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("[REDIS] Cache HIT for restaurants list");
      return res.json(JSON.parse(cached));
    }

    // 2. Cache MISS — fetch from DynamoDB
    console.log("[REDIS] Cache MISS — fetching restaurants from DynamoDB");
    const list = await db.scan({ TableName: "Restaurants" });
    const active = list.filter((r) => r.active !== false);

    // 3. Store in Redis cache for future requests
    await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(active));

    res.json(active);
  } catch (error) {
    console.error("Get Restaurants Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenuByRestaurant = async (req, res) => {
  const restaurantId = parseInt(req.query.restaurantId);

  if (isNaN(restaurantId)) {
    return res.status(400).json({ message: "Valid restaurantId is required" });
  }

  const cacheKey = `menu:restaurant:${restaurantId}`;
  try {
    // 1. Try Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`[REDIS] Cache HIT for menu of restaurant ${restaurantId}`);
      return res.json(JSON.parse(cached));
    }

    // 2. Cache MISS — fetch from DynamoDB
    console.log(`[REDIS] Cache MISS — fetching menu for restaurant ${restaurantId} from DynamoDB`);
    const items = await db.query({
      TableName: "Menu",
      KeyConditionExpression: "restaurantId = :restaurantId",
      ExpressionAttributeValues: {
        ":restaurantId": restaurantId,
      },
    });

    // Fallback: if no items match, scan and filter
    let result = items;
    if (items.length === 0) {
      const allMenu = await db.scan({ TableName: "Menu" });
      result = allMenu.map(item => ({ ...item, restaurantId }));
    }

    // 3. Store in Redis cache for future requests
    await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
