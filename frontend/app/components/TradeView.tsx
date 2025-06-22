import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({
  market,
}: {
  market: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);

  useEffect(() => {
    const init = async () => {
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(market, "1h", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000)); 
      } catch (e) {
        console.log('Error fetching klines:', e);
        // Generate some sample data if API fails
        klineData = generateSampleKlineData();
      }

      if (chartRef.current) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        
        const chartData = klineData.length > 0 ? klineData.map((x) => ({
          close: parseFloat(x.close),
          high: parseFloat(x.high),
          low: parseFloat(x.low),
          open: parseFloat(x.open),
          timestamp: new Date(x.end), 
        })).sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) : generateSampleChartData();

        const chartManager = new ChartManager(
          chartRef.current,
          chartData,
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        chartManagerRef.current = chartManager;
      }
    };
    init();

    return () => {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
        chartManagerRef.current = null;
      }
    };
  }, [market]);

  return (
    <>
      <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    </>
  );
}

function generateSampleKlineData(): KLine[] {
  const data: KLine[] = [];
  const now = Date.now();
  const basePrice = 150;
  
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * 60 * 60 * 1000; // 1 hour intervals
    const open = basePrice + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    
    data.push({
      open: open.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: (Math.random() * 1000).toFixed(2),
      quoteVolume: (Math.random() * 150000).toFixed(2),
      start: new Date(timestamp).toISOString(),
      end: new Date(timestamp + 60 * 60 * 1000).toISOString(),
      trades: Math.floor(Math.random() * 100).toString()
    });
  }
  
  return data;
}

function generateSampleChartData() {
  const data = [];
  const now = Date.now();
  const basePrice = 150;
  
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now - (100 - i) * 60 * 60 * 1000);
    const open = basePrice + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close
    });
  }
  
  return data;
}