"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060913] text-gray-200 font-sans">
        <div className="p-8 bg-[#0d1323] border border-[#1e293b] rounded-2xl shadow-xl w-[400px]">
          <div className="flex justify-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              MR.H <span className="text-[#4f46e5]">Studio</span>
            </h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <p className="text-sm font-medium text-center text-red-400 bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                {error}
              </p>
            )}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 text-sm text-gray-100 transition-all bg-[#060913] border border-[#1e293b] rounded-xl focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] placeholder-gray-600"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-sm text-gray-100 transition-all bg-[#060913] border border-[#1e293b] rounded-xl focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] placeholder-gray-600"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 text-sm font-semibold text-white transition-all rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // लॉग इन के बाद का डैशबोर्ड एरिया
  return (
    <div className="min-h-screen bg-[#060913] text-gray-200 font-sans">
      <nav className="flex items-center justify-between px-8 py-5 bg-[#0d1323] border-b border-[#1e293b]">
        <h1 className="text-xl font-bold text-white">
           MR.H <span className="text-[#4f46e5]">Studio</span> Admin
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-5 py-2 text-sm font-semibold text-white transition-all bg-[#1e293b] border border-gray-700 rounded-lg hover:bg-gray-800"
        >
          Logout
        </button>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="mb-8 text-2xl font-bold text-white">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 transition-all bg-[#0d1323] border border-[#1e293b] rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-100">Course Management</h3>
            <p className="mt-1 text-sm text-gray-500">Manage modules and admissions</p>
          </div>
          <div className="p-6 transition-all bg-[#0d1323] border border-[#1e293b] rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-100">Access Control</h3>
            <p className="mt-1 text-sm text-gray-500">Manage MongoDB admin roles</p>
          </div>
          <div className="p-6 transition-all bg-[#0d1323] border border-[#1e293b] rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-100">Data Logs</h3>
            <p className="mt-1 text-sm text-gray-500">Track system activities</p>
          </div>
        </div>

        {/* File Upload & Import Control Area */}
        <div className="mt-8 p-6 bg-[#0d1323] border border-[#1e293b] rounded-2xl">
          <h3 className="mb-2 text-lg font-bold text-white">LMS File Control (Upload & Import)</h3>
          <p className="text-gray-500 text-sm mb-6">
            Manage course resources securely directly to your storage.
          </p>
          <div className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-[#334155] rounded-xl bg-[#060913] transition hover:border-[#4f46e5]">
            <svg className="w-8 h-8 mb-3 text-[#4f46e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-1 text-sm text-gray-400"><span className="font-semibold text-[#4f46e5] cursor-pointer">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-600">PDF, MP4, ZIP (LMS Data)</p>
          </div>
        </div>
      </div>
    </div>
  );
}