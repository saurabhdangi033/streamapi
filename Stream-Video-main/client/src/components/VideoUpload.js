import React, { useState } from 'react';
import axios from 'axios';
import './videoUpload.css';

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video || !title) {
      setError('Please provide both a title and a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Video uploaded successfully!');
      setError(null);
      console.log(res.data);
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('Error uploading video. Please try again.');
    }
  };

  return (
    <div>
      <h2>Upload a Video</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default VideoUpload;
