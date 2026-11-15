import { useState } from "react";
import { forgotPassword } from "../services/api";

import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

function ForgotPassword({ darkMode, setAuthScreen, setResetEmail }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
        const response = await forgotPassword(email);

      setMessage(response.data.message);
      setResetEmail(email);

      setTimeout(() => {
        setAuthScreen("verify");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-slate-950">
      <div className="w-full max-w-md p-8 border shadow-2xl bg-slate-900 border-cyan-500 rounded-3xl">

        <button
          onClick={() => setAuthScreen("login")}
          className="flex items-center gap-2 mb-6 text-cyan-400 hover:text-cyan-300"
        >
          <FaArrowLeft /> Back to Login
        </button>

        <h1 className="mb-2 text-3xl font-bold text-center text-cyan-400">
          Forgot Password
        </h1>

        <p className="mb-8 text-center text-gray-400">
          Enter your registered email address to receive a secure OTP.
        </p>

        <form onSubmit={handleSendOTP} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute text-gray-400 left-4 top-4" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 text-white border outline-none rounded-xl bg-slate-800 border-slate-700 focus:border-cyan-500"
              required
            />
          </div>

          {message && (
            <div className="p-3 text-center text-white bg-green-600 rounded-xl">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 text-center text-white bg-red-600 rounded-xl">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full p-4 font-bold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;