import React, { useState } from 'react';

function CreateShow() {
  const [image_url, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(5);
  const [year, setYear] = useState(2025);
  const [published, setPublished] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !venue || !image_url || !month || !day || !year) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/shows', {
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
    <div>
      <h3>Create Show</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="venue"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="image_url"
            placeholder="Image URL"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="day"
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label>
            Published:
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished(!published)}
            />
          </label>
        </div>
        <button type="submit">Create Show</button>
      </form>

      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </div>
    </div>
  );
}

export default CreateShow;
