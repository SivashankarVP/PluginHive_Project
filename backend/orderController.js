import { db, s3, ses } from "./awsClient.js";

export const placeOrder = async (req, res) => {
  const { restaurantId, totalAmount, paymentMode, address, items } = req.body;
  const userId = req.user.id;

  if (!restaurantId || !totalAmount || !paymentMode || !address || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order details" });
  }

  try {
    const orderId = Date.now();
    
    // 1. Generate text receipt for AWS S3 upload
    const dateStr = new Date().toLocaleString();
    const invoiceContent = `
========================================
            CRAVEGO RECEIPT
========================================
Order ID: ${orderId}
Date: ${dateStr}
Customer ID: ${userId}
Restaurant ID: ${restaurantId}
Address: ${address}
Payment Mode: ${paymentMode}
----------------------------------------
Items:
${items.map(item => `- ${item.name} x ${item.quantity} (₹${item.price})`).join("\n")}
----------------------------------------
Total Paid: ₹${totalAmount}
========================================
Thank you for ordering with CraveGo!
`;

    // 2. Upload Invoice PDF/Text to AWS S3
    const invoiceUrl = await s3.uploadInvoice(orderId, invoiceContent);

    // 3. Save Order to Database (DynamoDB / Mock)
    const newOrder = {
      id: orderId,
      userId: userId,
      restaurantId: parseInt(restaurantId),
      totalAmount: parseInt(totalAmount),
      status: "Confirmed",
      paymentMode,
      address,
      invoiceUrl,
      orderDate: new Date().toISOString(),
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price
      }))
    };

    await db.put({ TableName: "Orders", Item: newOrder });

    // 4. Send Confirmation Email via AWS SES
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #ff9800; text-align: center;">CraveGo Order Confirmed!</h2>
        <p>Hi there,</p>
        <p>Your order has been successfully placed and confirmed. Here are your order details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #ddd;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: center; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.name}</td>
                <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">₹${item.price * item.quantity}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <h3 style="text-align: right; color: #333;">Total: ₹${totalAmount}</h3>
        <p><strong>Delivery Address:</strong> ${address}</p>
        <p><strong>Payment Mode:</strong> ${paymentMode}</p>
        <p style="text-align: center; margin-top: 30px;">
          <a href="${invoiceUrl}" target="_blank" style="background-color: #ff9800; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Invoice</a>
        </p>
      </div>
    `;

    // Try sending email (we wrap it so it doesn't crash the server if SES is unverified in sandbox)
    try {
      // Find user email
      const users = await db.scan({ TableName: "Users" });
      const currentUser = users.find((u) => u.id === userId);
      if (currentUser && currentUser.email) {
        await ses.sendEmail(
          currentUser.email,
          `CraveGo Order Confirmed - #${orderId}`,
          emailBody
        );
      }
    } catch (sesErr) {
      console.warn("SES Email failed (normal in sandbox/local mode):", sesErr.message);
    }

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await db.query({
      TableName: "Orders",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    // If query returned nothing, scan and filter as safety fallback
    if (orders.length === 0) {
      const allOrders = await db.scan({ TableName: "Orders" });
      const userOrders = allOrders.filter(o => String(o.userId) === String(userId));
      return res.json(userOrders.sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate)));
    }

    res.json(orders.sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate)));
  } catch (error) {
    console.error("Get Order History Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
