import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} />} />
        <Route path="/playlist/:id" element={<PlaylistDetail searchQuery={searchQuery} />} />
        <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
      </Routes>
    </Router>
  );
}

export default App;