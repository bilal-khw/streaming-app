import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Hls from 'hls.js';

function StreamDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get('accessToken');
  const videoRef = useRef(null);
  const stream = location.state?.stream;

  useEffect(() => {
    if (!stream || !videoRef.current) return;

    const video = videoRef.current;
    const videoSrc = stream.url;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
      });

      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }, [stream]);

  if (!token || !stream) {
    navigate('/');
    return null;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/streams')}
        className="mb-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
      >
        ← Back to Streams
      </button>

      {/* Stream Details Card */}
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Stream Title */}
        <h2 className="text-2xl font-semibold text-center mb-4">{stream.streamTitle}</h2>

        {/* Video Player */}
        <div className="my-4">
          <video
            ref={videoRef}
            controls
            className="w-full max-w-3xl rounded-lg shadow-lg"
          />
        </div>

        {/* Stream Info */}
        <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3 text-white">📡 Stream Info</h3>
          <div className="grid grid-cols-1 gap-2 text-gray-300 text-sm w-full max-w-md">
            <p><strong>Status:</strong> {stream.status}</p>
            <p><strong>Views:</strong> {stream.views}</p>
            <p><strong>Start Time:</strong> {formatDate(stream.startTime)}</p>
            {stream.endTime && <p><strong>End Time:</strong> {formatDate(stream.endTime)}</p>}
            <p><strong>Chat Available:</strong> {stream.hasChat ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {formatDate(stream.createdAt)}</p>
            <p><strong>Last Updated:</strong> {formatDate(stream.updatedAt)}</p>
          </div>
        </div>

        {/* Player & Game Details Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Game Details */}
          {stream.Game && (
            <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col justify-center items-center min-h-[200px]">
              <h3 className="text-xl font-semibold mb-3">🎮 Game Details</h3>
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={stream.Game.game_icon}
                  alt={stream.Game.name}
                  className="w-12 h-12 rounded-full border border-gray-500"
                />
                <p className="text-lg">{stream.Game.name}</p>
              </div>
              <h4 className="text-md font-semibold mt-3">Game Cover:</h4>
              {stream.Game.coverImage && (
                <img
                  src={stream.Game.coverImage}
                  alt={`${stream.Game.name} cover`}
                  className="w-full max-w-xs mt-2 rounded-lg shadow-lg"
                />
              )}
            </div>
          )}

          {/* Player Details */}
          {stream.Player && (
            <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col justify-center items-center min-h-[200px]">
              <h3 className="text-xl font-semibold mb-3">🧑 Player Details</h3>
              <div className="flex items-center space-x-4">
                {stream.Player.profile_image && (
                  <img
                    src={stream.Player.profile_image}
                    alt="Player profile"
                    className="w-12 h-12 rounded-full border border-gray-500"
                  />
                )}
                <div className="text-center">
                  <p><strong>ID:</strong> {stream.Player.id}</p>
                  {stream.Player.name && <p><strong>Name:</strong> {stream.Player.name}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StreamDetail;
