import { useEffect, useState } from "react"
import { useParams } from "react-router"
import PriceChart from "./PriceChart"

const API_KEY = import.meta.env.VITE_APP_API_KEY

// Format a number as USD, or return a dash when missing
const usd = value =>
  value != null ? `$${value.toLocaleString("en-US")} USD` : "—"

function CoinDetail() {
  const { id } = useParams()
  const [fullDetails, setFullDetails] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getCoinDetail = async () => {
      setFullDetails(null)
      setError(null)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
        {
          headers: {
            "x-cg-demo-api-key": API_KEY,
          },
        }
      )
      if (!response.ok) {
        // 429 = CoinGecko rate limit, 404 = unknown coin id, etc.
        throw new Error(`Request failed (${response.status})`)
      }
      const json = await response.json()
      setFullDetails(json)
    }

    getCoinDetail().catch(err => {
      console.error(err)
      setError(err.message)
    })
  }, [id])

  const market = fullDetails?.market_data

  return (
    <div className="coin-detail">
      {fullDetails && market ? (
        <>
          <h1>
            {fullDetails.name} ({fullDetails.symbol?.toUpperCase()})
          </h1>
          <img
            className="images"
            src={fullDetails.image?.large}
            alt={`Icon for ${fullDetails.name} crypto coin`}
          />
          <div
            className="description"
            // CoinGecko descriptions include safe HTML links
            dangerouslySetInnerHTML={{
              __html:
                fullDetails.description?.en || "No description available.",
            }}
          />
          <br />
          <div className="algorithm">
            This coin was built with the algorithm{" "}
            <strong>{fullDetails.hashing_algorithm || "N/A"}</strong>
          </div>

          <table>
            <tbody>
              <tr>
                <th>Launch Date</th>
                <td>{fullDetails.genesis_date || "—"}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>
                  {fullDetails.links?.homepage?.[0] ? (
                    <a
                      href={fullDetails.links.homepage[0]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {fullDetails.links.homepage[0]}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr>
                <th>Whitepaper</th>
                <td>
                  {fullDetails.links?.whitepaper ? (
                    <a
                      href={fullDetails.links.whitepaper}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read whitepaper
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
              <tr>
                <th>Monetary Symbol</th>
                <td>{fullDetails.symbol?.toUpperCase()}</td>
              </tr>
              <tr>
                <th>Market Cap Rank</th>
                <td>{fullDetails.market_cap_rank ?? "—"}</td>
              </tr>
              <tr>
                <th>Current Price</th>
                <td>{usd(market.current_price?.usd)}</td>
              </tr>
              <tr>
                <th>Volume (24h)</th>
                <td>{usd(market.total_volume?.usd)}</td>
              </tr>
              <tr>
                <th>Today's High Price</th>
                <td>{usd(market.high_24h?.usd)}</td>
              </tr>
              <tr>
                <th>Today's Low Price</th>
                <td>{usd(market.low_24h?.usd)}</td>
              </tr>
              <tr>
                <th>Change (24h)</th>
                <td>
                  {market.price_change_percentage_24h != null
                    ? `${market.price_change_percentage_24h.toFixed(2)}%`
                    : "—"}
                </td>
              </tr>
              <tr>
                <th>Market Cap</th>
                <td>{usd(market.market_cap?.usd)}</td>
              </tr>
              <tr>
                <th>Circulating Supply</th>
                <td>
                  {market.circulating_supply != null
                    ? market.circulating_supply.toLocaleString("en-US")
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>

          <PriceChart id={id} symbol={fullDetails.symbol?.toUpperCase()} />
        </>
      ) : error ? (
        <div>
          <h2>Couldn't load this coin.</h2>
          <p>
            {error.includes("429")
              ? "CoinGecko is rate-limiting requests. Wait a minute and refresh."
              : error}
          </p>
        </div>
      ) : (
        <h2>Loading details...</h2>
      )}
    </div>
  )
}

export default CoinDetail
