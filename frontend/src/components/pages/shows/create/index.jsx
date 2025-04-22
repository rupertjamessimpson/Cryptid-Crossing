import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import API_BASE_URL from '../../../../config';

function Create() {
  const navigate = useNavigate();

  const [image_url, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2025);
  const [published, setPublished] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imgurImages, setImgurImages] = useState([]);

  useEffect(() => {
    const fetchImgurImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/imgur`);
        const data = await res.json();
        console.log("Imgur images:", data.data);
        setImgurImages(data.data);
      } catch (err) {
        console.error("Imgur proxy fetch failed", err);
      }
    };
  
    fetchImgurImages();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include'
        });
        if (res.ok) {
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };
  
    checkLogin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !venue || !image_url || !month || !day || !year) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/shows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url,
          description,
          venue,
          month,
          day,
          year,
          published,
        }),
      });

      if (response.ok) {
        setSuccess("Show created successfully!");
        setImageUrl('');
        setDescription('');
        setVenue('');
        setMonth(5);
        setDay(5);
        setYear(2025);
        setPublished(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create show");
      }
    } catch (error) {
      setError("An error occurred while creating the show");
    }
  };

  return (
    <div className='create-container'>
      <h3>New Show</h3>
      <div className='create-form'>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="image_url">Select Image</label>
          <select
            id="image_url"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
          >
            <option value="">-- Select an image --</option>
            {imgurImages.map((img) => (
              <option key={img.id} value={img.link}>
                {img.name || img.id}
              </option>
            ))}
          </select>
          {image_url && (
            <img src={image_url} alt="Selected" style={{ marginTop: "10px", maxWidth: "200px" }} />
          )}
        </div>

        <div className="form-row">
          <label htmlFor="month">Month</label>
          <input
            type="number"
            id="month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="day">Day</label>
          <input
            type="number"
            id="day"
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="published">Publish?</label>
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={() => setPublished(!published)}
          />
        </div>
        <div className='button-container'>
          <button className="create-button" type="submit">Create Show</button>
        </div>
      </form>

      </div>
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </div>
    </div>
  );
}

export default Create;