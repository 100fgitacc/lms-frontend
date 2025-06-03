import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className="">
      <div>
        <div>
          <div>
            <div className="text-center">
              <div className="">
                <h1 className="">404</h1>
              </div>

              <div className="">
                <h3 className="">
                  Look like you're lost
                </h3>

                <p>The page you are looking for not available!</p>

                <Link to='/'
                  className=""
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PageNotFound