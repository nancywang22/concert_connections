import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArtistSearch from "./pages/ArtistSearch";
import ConcertLog from "./pages/ConcertLog";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <nav className="flex space-x-4 mb-6">
          <Link to="/search" className="text-blue-600 font-semibold">Search Artists</Link>
          <Link to="/log" className="text-blue-600 font-semibold">Log Concert</Link>
        </nav>

        <Routes>
          <Route path="/search" element={<ArtistSearch />} />
          <Route path="/log" element={<ConcertLog />} />
        </Routes>
      </div>
    </Router>
  );
}
