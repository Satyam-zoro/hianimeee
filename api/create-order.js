// File: api/create-order.js
const Razorpay = require('razorpay');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const { amountInINR } = req.body;
        const amountInPaise = amountInINR * 100;

        const options = {
            amount: amountInPaise,
            currency: "INR", 
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
        };

        const order = await razorpay.orders.create(options);

        // THE FIX: We send the keyId directly to the frontend here
        res.status(200).json({ 
            success: true, 
            order_id: order.id, 
            amount: options.amount,
            keyId: process.env.RAZORPAY_KEY_ID 
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        const errorMessage = error.description || error.message || JSON.stringify(error);
        res.status(500).json({ 
            success: false, 
            error: errorMessage 
        });
    }
}
