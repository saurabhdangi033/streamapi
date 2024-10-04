import React, { useState } from 'react';
import axios from 'axios';
import './uploadForm.css';

const UploadForm = () => {
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !videoFile) {
            setMessage('Please provide both a title and a video file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', videoFile);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage('Video upload failed.');
        }
    };

    return (
        <div>
            <h2>Upload Video</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input 
                    type="text" 
                    placeholder="Enter title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="videoFile">Video Upload</label>
                <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                />
                <button type="submit">Upload Video</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UploadForm;
