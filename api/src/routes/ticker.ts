import { Router } from "express";

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {    
    // Generate random price and volume for demo purposes
    const lastPrice = (150 + Math.random() * 10).toFixed(2);
    const high = (155 + Math.random() * 5).toFixed(2);
    const volume = (10000 + Math.floor(Math.random() * 1000)).toString();
    const priceChangePercent = (Math.random() * 5).toFixed(2);

    res.json([
        {
            symbol: "SOL_USDC",
            lastPrice,
            high,
            volume,
            priceChangePercent
        }
    ]);
});