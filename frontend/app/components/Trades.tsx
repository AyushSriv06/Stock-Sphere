"use client";

import { useEffect, useState } from "react";
import { getTrades } from "../utils/httpClient";
import { Trade } from "../utils/types";
import { SignalingManager } from "../utils/SignalingManager";

export function Trades({ market }: { market: string }) {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("trade", (data: any) => {
            console.log("trade has been updated");
            console.log(data);
            
            setTrades(prevTrades => {
                const newTrade: Trade = {
                    id: data.t,
                    isBuyerMaker: data.m,
                    price: data.p,
                    quantity: data.q,
                    quoteQuantity: (Number(data.p) * Number(data.q)).toString(),
                    timestamp: Date.now()
                };
                return [newTrade, ...prevTrades.slice(0, 99)]; // Keep only latest 100 trades
            });
        }, `TRADE-${market}`);
        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`trade@${market}`]});

        getTrades(market).then(t => {
            setTrades(t);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`trade@${market}`]});
            SignalingManager.getInstance().deRegisterCallback("trade", `TRADE-${market}`);
        }
    }, [market]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between text-xs p-2 border-b border-slate-800">
                <div className="text-white">Price</div>
                <div className="text-slate-500">Quantity</div>
                <div className="text-slate-500">Time</div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {trades.map((trade, index) => (
                    <TradeRow key={index} trade={trade} />
                ))}
            </div>
        </div>
    );
}

function TradeRow({ trade }: { trade: Trade }) {
    const time = new Date(trade.timestamp).toLocaleTimeString();
    
    return (
        <div className="flex justify-between text-xs p-2 hover:bg-slate-800">
            <div className={trade.isBuyerMaker ? "text-red-500" : "text-green-500"}>
                {trade.price}
            </div>
            <div className="text-white">
                {trade.quantity}
            </div>
            <div className="text-slate-500">
                {time}
            </div>
        </div>
    );
}