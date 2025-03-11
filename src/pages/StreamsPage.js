import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config";
console.log("🚀 ~ config:", config)
function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    
    const fetchStreams = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/player/getLiveStreams`,
          {
            withCredentials: true,
            headers: {
              versioncode: "300",
              currentversion: "2.0.8",
            },
          }
        );
        setStreams(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch live streams");
        setLoading(false);
        if (err.response?.status === 401) {
          Cookies.remove("accessToken");
          navigate("/");
        }
      }
    };
    
    fetchStreams();
  }, [token, navigate]);


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading streams...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-bold">🎥 Live Streams</h2>
        {/* <button
          onClick={fetchStreams()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
        >
          Refresh List
        </button> */}
      </div>

      {/* Streams Grid */}
      {streams.length === 0 ? (
        <p className="text-center text-gray-400">No live streams available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <Link
              key={stream.id}
              to={`/streams/${stream.id}`}
              state={{ stream }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-700"
            >
              <h3 className="text-lg font-semibold truncate">{stream.streamTitle}</h3>
              <p className="text-sm text-gray-400">
                <strong>Status:</strong> {stream.status}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Game:</strong> {stream.Game?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Views:</strong> {stream.views}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StreamsPage;
