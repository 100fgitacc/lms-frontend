import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className="page-not-found">
      <div className="inner">
          <img
            src="/assets/img/error.png"
            alt="404"
            className="error-image"
          />
          <div>
            <h1 className="error-code">404</h1>
            <p className="error-message">Oops, page not found</p>
            <Link to="/" className="home-link">Go to homepage</Link>
          </div>
        </div>
    </section>
  )
}

export default PageNotFound
