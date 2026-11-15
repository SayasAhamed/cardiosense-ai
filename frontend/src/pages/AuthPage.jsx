import { useState } from "react";
import axios from "axios";

import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";

function AuthPage({ setIsAuthenticated, setUserRole }) {
  // =========================================
  // LOGIN STATES
  // =========================================

  const [selectedRole, setSelectedRole] = useState("ADMIN");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // PASSWORD RESET FLOW
  // login → forgot → verify → reset
  // =========================================

  const [authScreen, setAuthScreen] = useState("login");
  const [resetEmail, setResetEmail] = useState("");

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (
        !data.role ||
        data.role.toLowerCase() !== selectedRole.toLowerCase()
      ) {
        setError(`Access denied for ${selectedRole} portal`);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      setIsAuthenticated(true);
      setUserRole(data.role);
    } catch (err) {
      console.error(err);
      setError("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ROLE CARD COMPONENT
  // =========================================

  const RoleCard = ({ role, title, desc, color }) => (
    <div
      onClick={() => setSelectedRole(role)}
      className={`cursor-pointer p-6 rounded-3xl transition-all duration-300 border-2 hover:scale-105 shadow-xl ${
        selectedRole === role
          ? `${color} border-white`
          : "bg-slate-800 border-transparent"
      }`}
    >
      <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>

      <p className="text-gray-200">{desc}</p>
    </div>
  );

  // =========================================
  // PASSWORD RESET PAGES
  // =========================================

  if (authScreen === "forgot") {
    return (
      <ForgotPassword
        darkMode={true}
        setAuthScreen={setAuthScreen}
        setResetEmail={setResetEmail}
      />
    );
  }

  if (authScreen === "verify") {
    return (
      <VerifyOTP
        darkMode={true}
        email={resetEmail}
        setAuthScreen={setAuthScreen}
      />
    );
  }

    if (authScreen === "reset") {
    return (
        <ResetPassword
        darkMode={true}
        email={resetEmail}
        setAuthScreen={setAuthScreen}
        />
    );
    }

  // =========================================
  // LOGIN SCREEN
  // =========================================

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-slate-950">
      <div className="w-full max-w-6xl">
        {/* TITLE */}

        <div className="text-center mb-14">
          <h1 className="mb-4 text-6xl font-extrabold text-cyan-400">
            CardioSense AI
          </h1>

          <p className="text-xl text-gray-400">
            Clinical Heart Disease Severity Prediction Platform
          </p>
        </div>

        {/* ROLE PORTALS */}

        <div className="grid grid-cols-1 gap-8 mb-14 md:grid-cols-3">
          <RoleCard
            role="ADMIN"
            title="Admin Portal"
            desc="Manage system users, analytics and hospital operations."
            color="bg-red-600"
          />

          <RoleCard
            role="DOCTOR"
            title="Doctor Portal"
            desc="Create predictions, clinical reports and AI explanations."
            color="bg-cyan-600"
          />

          <RoleCard
            role="STAFF"
            title="Staff Portal"
            desc="Register patients and manage limited patient information."
            color="bg-green-600"
          />
        </div>

        {/* LOGIN FORM */}

        <div className="max-w-xl p-10 mx-auto border shadow-2xl bg-slate-900 rounded-3xl border-cyan-500">
          <h2 className="mb-8 text-4xl font-bold text-center text-white">
            {selectedRole} Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-white border outline-none rounded-xl bg-slate-800 border-slate-700 focus:border-cyan-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-white border outline-none rounded-xl bg-slate-800 border-slate-700 focus:border-cyan-500"
              required
            />

            {error && (
              <div className="p-4 text-center text-white bg-red-500 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 text-xl font-bold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* FORGOT PASSWORD */}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setError("");
                setResetEmail("");
                setAuthScreen("forgot");
              }}
              className="font-medium transition text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;