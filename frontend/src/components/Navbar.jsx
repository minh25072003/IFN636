import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Left: App name */}
      <Link to="/" className="text-xl font-bold text-cyan-400 whitespace-nowrap">
        Video Playlist Manager
      </Link>

      {/* Centre: Search bar */}
      {user && (
        <div className="flex-1 mx-8">
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search playlists..."
            className="w-full bg-gray-700 text-white rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      )}

      {/* Right: Nav links */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/profile" className="text-sm hover:text-cyan-400">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:text-cyan-400">Login</Link>
            <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;