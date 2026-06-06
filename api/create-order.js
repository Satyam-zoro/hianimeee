// File: api/create-order.js
const Razorpay = require('razorpay');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Initialize Razorpay with your Vercel Environment Variables
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const { amountInUSD } = req.body;

        // Razorpay expects amounts in the smallest currency unit (cents/paise)
        const amountInSubUnits = amountInUSD * 100;

        const options = {
            amount: amountInSubUnits,
            currency: "USD", // Change to "INR" if your Razorpay account is India-only
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
        };

        // Create the order on Razorpay's servers
        const order = await razorpay.orders.create(options);

        // Send the secure order_id back to your frontend
        res.status(200).json({ 
            success: true, 
            order_id: order.id, 
            amount: options.amount 
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, error: "Failed to create order" });
    }
}