import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './index.css';
import API_BASE_URL from '../../../config';

function Shows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include'
        });
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    const fetchShows = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/shows`);
        if (response.ok) {
          const data = await response.json();

          const sorted = data.sort((a, b) => {
            const dateA = new Date(a.year, a.month - 1, a.day);
            const dateB = new Date(b.year, b.month - 1, b.day);
            return dateB - dateA;
          });

          setShows(sorted);
        } else {
          setError('Failed to fetch shows');
        }
      } catch (error) {
        setError('An error occurred while fetching shows');
      }
    };

    checkLogin();
    fetchShows();
  }, []);

  return (
    <div className='shows'>
      <h3>Shows</h3>
      <p>Click on a past show to read more!</p>
      <div className='pin-container'>
        <img
          width={50}
          height={50}
          src="/images/Pin.png"
          alt="Pin"
        />
      </div>
      <div className="shows-list-wrapper">
        {shows.length > 0 ? (
          <ul className="shows-list">
            {shows.map((show) => (
              <li key={show.id} className={show.published ? "published" : ""}>
                {(show.published || isLoggedIn) ? (
                  <Link to={`/shows/${show.id}`} className="show-link">
                    <div className="show-li-container">
                      <img
                        width={50}
                        height={50}
                        src={
                          show.published
                            ? "/images/SolidLine.png"
                            : "/images/DashedLine.png"
                        }
                        alt={show.published ? "Published line" : "Unpublished line"}
                      />
                      <div className="show-details">
                        <div>{show.venue}</div>
                        <div>{show.month}/{show.day}/{show.year}</div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="show-li-container">
                    <img
                      width={50}
                      height={50}
                      src="/images/DashedLine.png"
                      alt="Unpublished line"
                    />
                    <div className="show-details">
                      <div>{show.venue}</div>
                      <div>{show.month}/{show.day}/{show.year}</div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div>no shows found {error}</div>
        )}
      </div>

      {isLoggedIn && (
        <a className='add' href='/shows/create'>Add a show</a>
      )}
    </div>
  );
}

export default Shows;
