import { useEffect, useState } from "react"

import PredictionForm from "./components/PredictionForm"
import PatientForm from "./components/PatientForm"
import PatientList from "./components/PatientList"
import PredictionHistory from "./components/PredictionHistory"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import UserManagement from "./components/UserManagement"

import AuthPage from "./pages/AuthPage"

function App() {

  // =========================================
  // AUTH STATES
  // =========================================

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [userRole, setUserRole] = useState("")

  // =========================================
  // THEME
  // =========================================

  const [darkMode, setDarkMode] = useState(true)

  // =========================================
  // ACTIVE TAB
  // =========================================

  const [activeTab, setActiveTab] = useState("dashboard")

  // =========================================
  // REFRESH PATIENTS
  // =========================================

const [refreshPatients, setRefreshPatients] = useState(false)

const [editingPatient, setEditingPatient] = useState(null);

  // =========================================
  // LOAD SETTINGS
  // =========================================

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme")

    const token =
      localStorage.getItem("token")

    const role =
      localStorage.getItem("role")

    // THEME

    if (savedTheme === "light") {

      setDarkMode(false)

    }

    // AUTH CHECK

    if (token && role) {

      setIsAuthenticated(true)

      setUserRole(role)

    } else {

      localStorage.removeItem("token")

      localStorage.removeItem("role")

      localStorage.removeItem("user")

      setIsAuthenticated(false)

    }

  }, [])

  // =========================================
  // SAVE THEME
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    )

  }, [darkMode])

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token")

    localStorage.removeItem("role")

    localStorage.removeItem("user")

    setIsAuthenticated(false)

    setUserRole("")

  }

  // =========================================
  // LOGIN PAGE
  // =========================================

  if (!isAuthenticated) {

    return (

      <AuthPage

        setIsAuthenticated={setIsAuthenticated}

        setUserRole={setUserRole}

      />

    )
  }

  // =========================================
  // MAIN APP
  // =========================================

  return (

    <div
      className={`

        min-h-screen
        transition-all
        duration-500

        ${darkMode
          ? "bg-slate-950 text-white"
          : "bg-gray-100 text-slate-900"
        }

      `}
    >

      {/* HEADER */}

      <header
        className={`

          shadow-lg
          border-b

          ${darkMode
            ? "bg-slate-900 border-cyan-500"
            : "bg-white border-cyan-400"
          }

        `}
      >

        <div className="px-6 py-4 mx-auto max-w-7xl">

          {/* TOP */}

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-cyan-400">
                CardioSense AI
              </h1>

              <p className="mt-1 text-sm">

                <span className="text-gray-400">
                  Logged in as:
                </span>

                <span className="ml-2 font-bold uppercase text-cyan-400">

                  {userRole}

                </span>

              </p>

            </div>

            <div className="flex flex-wrap items-center gap-6">

              <p
                className={
                  darkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              >
                Clinical Heart Disease Severity Prediction System
              </p>

              {/* THEME BUTTON */}

              <button

                onClick={() => setDarkMode(!darkMode)}

                className="px-4 py-2 font-semibold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600"
              >

                {darkMode ? "☀️ Light" : "🌙 Dark"}

              </button>

              {/* LOGOUT */}

              <button

                onClick={handleLogout}

                className="px-4 py-2 font-semibold text-white transition bg-red-500 rounded-xl hover:bg-red-600"
              >

                Logout

              </button>

            </div>

          </div>

          {/* NAVBAR */}

          <div className="flex flex-wrap gap-4 mt-6">

            {[
              "dashboard",
              "prediction",
              "patients",
              "history",
              "analytics",

              ...(userRole === "ADMIN"
                ? ["users"]
                : []
              )
            ].map((tab) => (

              <button

                key={tab}

                onClick={() => setActiveTab(tab)}

                className={`

                  px-5
                  py-2
                  rounded-xl
                  capitalize
                  transition
                  font-semibold

                  ${activeTab === tab

                    ? "bg-cyan-500 text-white"

                    : darkMode

                      ? "bg-slate-800 hover:bg-slate-700"

                      : "bg-gray-200 hover:bg-gray-300"

                  }

                `}

              >

                {tab}

              </button>

            ))}

          </div>

        </div>

      </header>

      {/* MAIN CONTENT */}

      <main className="px-6 py-10 mx-auto max-w-7xl">

        {/* DASHBOARD */}

        {activeTab === "dashboard" && (

          <div>

            <h2 className="mb-6 text-5xl font-extrabold">

              AI-Powered <span className="text-cyan-400">
                Heart Disease
              </span> Prediction

            </h2>

            <p
              className={`

                text-lg
                leading-relaxed
                max-w-3xl

                ${darkMode
                  ? "text-gray-400"
                  : "text-gray-700"
                }

              `}
            >

              CardioSense AI helps doctors and clinical users
              predict heart disease severity using advanced
              machine learning models like XGBoost,
              Random Forest, and SVM.

            </p>

          </div>

        )}

        {/* PREDICTION */}

        {activeTab === "prediction" && (

          <PredictionForm darkMode={darkMode} />

        )}

        {/* PATIENTS */}

        {activeTab === "patients" && (
          <div className="space-y-10">
            <PatientForm
              darkMode={darkMode}
              editingPatient={editingPatient}
              setEditingPatient={setEditingPatient}
              onPatientAdded={() => {
                setRefreshPatients(!refreshPatients);
              }}
            />

            <PatientList
              darkMode={darkMode}
              refreshPatients={refreshPatients}
              setRefreshPatients={setRefreshPatients}
              setEditingPatient={setEditingPatient}
            />
          </div>
        )}

        {/* HISTORY */}

        {activeTab === "history" && (

          <PredictionHistory darkMode={darkMode} />

        )}

        {/* ANALYTICS */}

        {activeTab === "analytics" && (

          <AnalyticsDashboard darkMode={darkMode} />

        )}

        {/* USER MANAGEMENT */}

        {activeTab === "users" && userRole === "ADMIN" && (

          <UserManagement darkMode={darkMode} />

        )}

      </main>

    </div>

  )
}

export default App