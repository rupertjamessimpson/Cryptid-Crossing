import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./index.css"
import API_BASE_URL from '../../../../config';

function Details() {
  const [show, setShow] = useState({});
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { id } = useParams();

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

    const fetchShow = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/shows/${id}`);
        if (response.ok) {
          const data = await response.json();
          setShow(data);
        } else {
          setError('Failed to fetch shows');
        }
      } catch (error) {
        setError('An error occurred while fetching shows');
      }
    };

    checkLogin();
    fetchShow();
  }, [id]);

  return (
    <div className='details'>
      {error && <p>{error}</p>}
      {show.id && (
        <div>
          <h2>{show.venue}</h2>
          <p>{show.month}/{show.day}/{show.year}</p>
          <img src={show.image_url} height={300} width={300} alt={`Show at ${show.venue}`} />
          <p style={{ whiteSpace: 'pre-line' }}>{show.description}</p>
        </div>
      )}
      {isLoggedIn && 
      <a className='edit-button' href={`/shows/edit/${id}`}>Edit show</a>}
    </div>
  );
}

export default Details;