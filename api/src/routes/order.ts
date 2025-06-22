import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, CANCEL_ORDER, ON_RAMP, GET_OPEN_ORDERS } from "../types";

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    console.log({ market, price, quantity, side, userId })
    
    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: CREATE_ORDER,
            data: {
                market,
                price,
                quantity,
                side,
                userId
            }
        });
        res.json(response.payload);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

orderRouter.delete("/", async (req, res) => {
    const { orderId, market } = req.body;
    
    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: CANCEL_ORDER,
            data: {
                orderId,
                market
            }
        });
        res.json(response.payload);
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

orderRouter.get("/open", async (req, res) => {
    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: GET_OPEN_ORDERS,
            data: {
                userId: req.query.userId as string,
                market: req.query.market as string
            }
        });
        res.json(response.payload);
    } catch (error) {
        console.error('Error getting open orders:', error);
        res.status(500).json({ error: 'Failed to get open orders' });
    }
});

// Add onramp endpoint for funding accounts
orderRouter.post("/onramp", async (req, res) => {
    const { userId, amount } = req.body;
    
    try {
        const response = await RedisManager.getInstance().sendAndAwait({
            type: ON_RAMP,
            data: {
                userId,
                amount: amount.toString(),
                txnId: Math.random().toString(36).substring(2, 15)
            }
        });
        res.json({ success: true, message: 'Funds added successfully' });
    } catch (error) {
        console.error('Error adding funds:', error);
        res.status(500).json({ error: 'Failed to add funds' });
    }
});