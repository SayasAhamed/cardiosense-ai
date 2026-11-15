
import { useState } from "react";
import { resetPassword } from "../services/api";
import { FaLock, FaArrowLeft } from "react-icons/fa";

function ResetPassword({ darkMode, email, setAuthScreen }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter the valid 6-digit OTP.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(
        email,
        otp,
        newPassword,
        confirmPassword
      );

      setMessage(
        response.data.message || "Password reset successfully!"
      );

      setTimeout(() => {
        setAuthScreen("login");
      }, 1800);

    } catch (err) {
      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Password reset failed. Please check your OTP and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500"
  }`;

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-6 ${
        darkMode ? "bg-slate-950" : "bg-cyan-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border ${
          darkMode
            ? "bg-slate-900 border-cyan-500"
            : "bg-white border-cyan-300"
        }`}
      >
        <button
          type="button"
          onClick={() => setAuthScreen("verify")}
          className="flex items-center gap-2 mb-6 text-cyan-400 hover:text-cyan-300"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="flex justify-center mb-5">
          <FaLock className="text-5xl text-cyan-400" />
        </div>

        <h2 className="text-3xl font-bold text-center text-cyan-400">
          Reset Password
        </h2>

        <p className="mt-2 text-center text-gray-400">
          Create a new secure password for
        </p>

        <p className="mb-6 font-semibold text-center text-cyan-400">
          {email}
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6-digit OTP"
            className={`${inputClass} text-center tracking-[6px]`}
            required
          />

          <input
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="New Password (minimum 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            required
          />

          <input
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
          />

          {message && (
            <div className="p-3 text-center text-green-400 rounded-xl bg-green-500/10">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 text-center text-red-400 rounded-xl bg-red-500/10">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
