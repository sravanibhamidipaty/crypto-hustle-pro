import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const API_KEY = import.meta.env.VITE_APP_API_KEY

function PriceChart({ id, symbol }) {
  const [history, setHistory] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getHistory = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`,
          {
            headers: {
              "x-cg-demo-api-key": API_KEY,
            },
            signal: controller.signal,
          }
        )
        const json = await response.json()
        // CoinGecko returns prices as [timestampMs, price] pairs
        const points = json.prices.map(([time, price]) => ({
          date: new Date(time).toLocaleDateString(),
          price,
        }))
        setHistory(points)
      } catch (error) {
        if (error.name === "AbortError") {
          // cancelled on navigate-away, ignore
        } else {
          console.error(error)
        }
      }
    }

    getHistory()
    return () => controller.abort()
  }, [id])

  if (!history) return null

  return (
    <div className="chart-wrap">
      <h2>30-Day Price Data for {symbol}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={history}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#aaa"
            label={{ value: "Date and Time", position: "bottom", fill: "#aaa" }}
          />
          <YAxis
            stroke="#aaa"
            domain={["auto", "auto"]}
            label={{
              value: "Price",
              angle: -90,
              position: "insideLeft",
              fill: "#aaa",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid #444",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3, fill: "white" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
