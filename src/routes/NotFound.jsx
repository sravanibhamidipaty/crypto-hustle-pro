import { Link } from "react-router"

function NotFound() {
  return (
    <main className="not-found">
      <p>There's nothing here!</p>
      <Link style={{ color: "white" }} to="/">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound
