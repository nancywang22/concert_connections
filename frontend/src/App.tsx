import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MainPage from "./pages/MainPage";
import LogConcertPage from "./pages/LogConcertPage";
import AuthPage from "./pages/AuthPage";

const App: React.FC = () => {
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Simple navigation */}
        <nav className="bg-white shadow p-4 flex gap-4">
          <Link to="/" className="text-blue-500 font-semibold">Home</Link>
          <Link to="/log" className="text-blue-500 font-semibold">Concerts</Link>
          <Link to="/auth" className="text-blue-500 font-semibold">Login</Link>
        </nav>

        {/* Page content */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/log" element={<LogConcertPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
