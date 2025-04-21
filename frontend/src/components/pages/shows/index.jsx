import React, { useState, useEffect } from 'react';

function Shows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:8000/shows');
        if (response.ok) {
          const data = await response.json();
          setShows(data);
        } else {
          setError('Failed to fetch shows');
        }
      } catch (error) {
        setError('An error occurred while fetching shows');
      }
    };

    fetchShows();
  }, []);

  return (
    <div>
      <h3>Shows</h3>
      {shows.length > 0 ? (
        <ul>
          {shows.map((show) => (
            <li key={show.id}>{show.description} - {show.venue}</li>
          ))}
        </ul>
      ) : (
        <div>no shows found {error}</div>
      )}
      <a href="/shows/create">Add a show</a>
    </div>
  );
}

export default Shows;
