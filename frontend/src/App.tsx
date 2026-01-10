import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MainPage from "./pages/MainPage";
import LogConcertPage from "./pages/LogConcertPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Simple navigation */}
        <nav className="bg-white shadow p-4 flex gap-4">
          <Link to="/main" className="text-blue-500 font-semibold">Main</Link>
          <Link to="/log" className="text-blue-500 font-semibold">Log Concert</Link>
        </nav>

        {/* Page content */}
        <main className="p-4">
          <Routes>
            <Route path="/main" element={<MainPage />} />
            <Route path="/log" element={<LogConcertPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
