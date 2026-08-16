import { db } from "./awsClient.js";

export const getRestaurants = async (req, res) => {
  try {
    const list = await db.scan({ TableName: "Restaurants" });
    const active = list.filter((r) => r.active !== false);
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

  try {
    // Check DynamoDB query
    const items = await db.query({
      TableName: "Menu",
      KeyConditionExpression: "restaurantId = :restaurantId",
      ExpressionAttributeValues: {
        ":restaurantId": restaurantId,
      },
    });
    
    // For demo/mock fallback convenience, if the query returns nothing, 
    // let's grab general menu items in db.json to show a menu
    if (items.length === 0) {
      const allMenu = await db.scan({ TableName: "Menu" });
      const fallbacks = allMenu.map(item => ({ ...item, restaurantId }));
      return res.json(fallbacks);
    }

    res.json(items);
  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
