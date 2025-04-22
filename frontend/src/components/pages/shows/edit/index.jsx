import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import API_BASE_URL from '../../../../config';

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [image_url, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2025);
  const [published, setPublished] = useState(false);
  const [imgurImages, setImgurImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include',
        });
        if (!res.ok) navigate('/login');
      } catch {
        navigate('/login');
      }
    };

    const fetchShow = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/shows/${id}`);
        const data = await res.json();
        setImageUrl(data.image_url);
        setDescription(data.description);
        setVenue(data.venue);
        setMonth(data.month);
        setDay(data.day);
        setYear(data.year);
        setPublished(data.published);
      } catch {
        setError('Failed to load show.');
      }
    };

    const fallbackImages = [
      {
        id: "poPj7WF",
        link: "https://i.imgur.com/poPj7WF.jpeg",
        name: "Fallback 1",
      },
      {
        id: "bApbUK6",
        link: "https://i.imgur.com/bApbUK6.jpeg",
        name: "Fallback 2",
      },
      {
        id: "XPQpwkb",
        link: "https://i.imgur.com/XPQpwkb.jpeg",
        name: "Fallback 3",
      },
      {
        id: "WPxAfPR",
        link: "https://i.imgur.com/WPxAfPR.jpeg",
        name: "Fallback 4",
      },
    ];

    const fetchImgurImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/imgur`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setImgurImages(data.data);
        } else {
          console.warn("Imgur format unexpected, using fallback");
          setImgurImages(fallbackImages);
        }
      } catch (err) {
        console.error("Imgur fetch failed, using fallback");
        setImgurImages(fallbackImages);
      }
    };

    checkLogin();
    fetchShow();
    fetchImgurImages();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/shows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url, description, venue, month, day, year, published }),
      });

      if (res.ok) {
        setSuccess('Show updated!');
        navigate('/shows/' + id);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to update.');
      }
    } catch {
      setError('Update failed.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/shows/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        navigate('/shows');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to delete.');
      }
    } catch {
      setError('Delete failed.');
    }
  };

  return (
    <div className="edit-container">
      <h3>Edit Show</h3>
      <div className="edit-form">
        <form onSubmit={handleUpdate}>
          <div className="form-row">
            <label htmlFor="venue">Venue</label>
            <input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="form-row">
            <label htmlFor="image_url">Select Image</label>
            <select id="image_url" value={image_url} onChange={(e) => setImageUrl(e.target.value)}>
              <option value="">-- Select an image --</option>
              {imgurImages.map((img) => (
                <option key={img.id} value={img.link}>
                  {img.name || img.id}
                </option>
              ))}
            </select>
            {image_url && <img src={image_url} alt="Selected" style={{ marginTop: "10px", maxWidth: "200px" }} />}
          </div>

          <div className="form-row">
            <label htmlFor="month">Month</label>
            <input type="number" id="month" value={month} onChange={(e) => setMonth(parseInt(e.target.value))} required />
          </div>

          <div className="form-row">
            <label htmlFor="day">Day</label>
            <input type="number" id="day" value={day} onChange={(e) => setDay(parseInt(e.target.value))} required />
          </div>

          <div className="form-row">
            <label htmlFor="year">Year</label>
            <input type="number" id="year" value={year} onChange={(e) => setYear(parseInt(e.target.value))} required />
          </div>

          <div className="form-row">
            <label htmlFor="published">Publish?</label>
            <input id="published" type="checkbox" checked={published} onChange={() => setPublished(!published)} />
          </div>

          <div className="button-container">
            <button className="edit-button" type="submit">Save Changes</button>
          </div>
        </form>
        <div className="button-container" style={{ marginTop: "1rem" }}>
          <button className="edit-button" onClick={handleDelete}>
            Delete Show
          </button>
        </div>
      </div>
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </div>
    </div>
  );
}

export default Edit;
