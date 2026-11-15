import { useState } from "react";
import { verifyOTP, resendOTP } from "../services/api";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

function VerifyOTP({ darkMode, email, setAuthScreen }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await verifyOTP(email, otp);

      setMessage(response.data.message);

      // Go to Reset Password page after success
      setTimeout(() => {
        setAuthScreen("reset");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      setMessage("A new OTP has been sent.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-slate-950">
      <div className="w-full max-w-md p-8 border shadow-2xl bg-slate-900 rounded-3xl border-cyan-500">

        <button
          onClick={() => setAuthScreen("forgot")}
          className="flex items-center gap-2 mb-6 text-cyan-400 hover:text-cyan-300"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="mb-6 text-center">
          <FaShieldAlt className="mx-auto mb-3 text-5xl text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Verify OTP</h2>
          <p className="mt-2 text-gray-400">
            Enter the 6-digit OTP sent to
          </p>
          <p className="font-semibold text-cyan-400">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            className="w-full p-4 text-center text-2xl tracking-[8px] text-white border outline-none rounded-xl bg-slate-800 border-slate-700 focus:border-cyan-500"
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
            className="w-full p-4 font-bold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="w-full mt-5 text-cyan-400 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;