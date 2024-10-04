import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './videoList.css';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/videos');
            setVideos(res.data);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        }
    };
    const handleDelete = async (id) => {
      try {
          const res = await axios.delete(`http://localhost:5000/videos/${id}`);
          setMessage(res.data.message); // Display success/failure message
  
          // If video is successfully deleted, update the list
          if (res.status === 200) {
              setVideos(videos.filter(video => video._id !== id));
          }
      } catch (error) {
          console.error('Failed to delete video:', error);
          setMessage('Failed to delete video.');
      }
  };
  
    return (
        <div>
            <h2>All Uploaded Videos</h2>
            <div className="video-container">
                {videos.length > 0 ? (
                    videos.map(video => (
                        <div key={video._id}>
                            <h3>{video.title}</h3>
                            <video width="400" controls>
                                <source src={video.videoUrl} type="video/mp4" />
                            </video>
                            <button 
                                className="delete-button" 
                                onClick={() => handleDelete(video._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No videos uploaded yet.</p>
                )}
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default VideoList;
