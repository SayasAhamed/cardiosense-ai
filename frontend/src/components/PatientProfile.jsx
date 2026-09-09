import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaUserCircle } from "react-icons/fa";

function PatientProfile({ patientId, darkMode, onClose }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // ====================================
  // FETCH PATIENT DETAILS
  // ====================================

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://127.0.0.1:8000/patients/${patientId}`
        );

        setPatient(response.data);
      } catch (error) {
        console.error("Error loading patient:", error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden ${
          darkMode
            ? "bg-slate-900 border-slate-700 text-white"
            : "bg-white border-gray-200 text-slate-900"
        }`}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between px-8 py-5 text-white bg-cyan-500">
          <div className="flex items-center gap-3">
            <FaUserCircle size={34} />
            <div>
              <h2 className="text-2xl font-bold">Patient Profile</h2>
              <p className="text-sm opacity-90">
                Registered Patient Information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xl transition hover:rotate-90"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}

        <div className="p-8">
          {loading ? (
            <p className="font-semibold text-center text-cyan-500">
              Loading patient details...
            </p>
          ) : patient ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <InfoCard
                  label="Patient ID"
                  value={patient.id}
                  darkMode={darkMode}
                />

                <InfoCard
                  label="Age"
                  value={patient.age}
                  darkMode={darkMode}
                />

                <InfoCard
                  label="Full Name"
                  value={patient.full_name}
                  darkMode={darkMode}
                />

                <InfoCard
                  label="Gender"
                  value={patient.gender}
                  darkMode={darkMode}
                />

                <InfoCard
                  label="Phone Number"
                  value={patient.phone}
                  darkMode={darkMode}
                />

                <InfoCard
                  label="Address"
                  value={patient.address || "No address available"}
                  darkMode={darkMode}
                />
              </div>

              <div
                className={`mt-8 p-5 rounded-2xl ${
                  darkMode ? "bg-slate-800" : "bg-cyan-50"
                }`}
              >
                <h3 className="mb-3 font-bold text-cyan-500">
                  Clinical Summary
                </h3>

                <p className="text-sm leading-7">
                  This patient is registered in the CardioSense AI system and
                  can be selected directly for heart disease severity prediction.
                  Previous predictions will also be linked to this patient.
                </p>
              </div>
            </>
          ) : (
            <div className="font-semibold text-center text-red-500">
              Unable to load patient information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================================
// SMALL INFO CARD
// ====================================

function InfoCard({ label, value, darkMode }) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-cyan-500">
        {label}
      </p>

      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default PatientProfile;