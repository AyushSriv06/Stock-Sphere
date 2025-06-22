import { Router } from "express";

export const tradesRouter = Router();

tradesRouter.get("/", async (req, res) => {
    const { market } = req.query;
    res.json([
        {
            price: (150 + Math.random() * 10).toFixed(2),
            quantity: (Math.random() * 5).toFixed(2),
            timestamp: Date.now(),
            // add other required fields as needed
        }
    ]);
});