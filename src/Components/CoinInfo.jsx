import { Link } from "react-router"

const CoinInfo = ({ id, image, name, symbol, price }) => {
  return (
    <li className="main-list">
      <Link className="coin-link" to={`/coinDetails/${id}`}>
        <span className="coin-name">
          <img
            className="icons"
            src={image}
            alt={`Small icon for ${name} crypto coin`}
          />
          {name} ({symbol?.toUpperCase()})
        </span>
        <span className="coin-price">
          {price != null ? `$${price} USD` : null}
        </span>
      </Link>
    </li>
  )
}

export default CoinInfo
