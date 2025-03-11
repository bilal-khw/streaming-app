import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import StreamsPage from './pages/StreamsPage';
import StreamDetail from './pages/StreamDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/streams" element={<StreamsPage />} />
        <Route path="/streams/:id" element={<StreamDetail />} />
      </Routes>
    </Router>
  );
}

export default App;