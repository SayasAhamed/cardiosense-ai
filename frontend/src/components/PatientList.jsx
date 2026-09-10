import { useEffect, useState } from "react";
import api from "../services/api";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

import ConfirmModal from "./ConfirmModal";
import PatientProfile from "./PatientProfile";

function PatientList({
  darkMode,
  refreshPatients,
  setRefreshPatients,
  setEditingPatient,
}) {
  // ============================
  // STATES
  // ============================

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [deletePatient, setDeletePatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);

  // ============================
  // FETCH PATIENTS
  // ============================

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/patients/");

      console.log("Patients Response:", response.data);

      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (refreshPatients !== undefined) {
      fetchPatients();
    }
  }, [refreshPatients]);

  // ============================
  // SEARCH
  // ============================

  const handleSearch = (value) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) => {
      return (
        patient.full_name.toLowerCase().includes(value.toLowerCase()) ||
        patient.phone.includes(value) ||
        String(patient.id).includes(value)
      );
    });

    setFilteredPatients(filtered);
  };

  // ============================
  // DELETE PATIENT
  // ============================

  const handleDeletePatient = async () => {
    if (!deletePatient) return;

    try {
      await api.delete(`/patients/${deletePatient.id}`);

      alert("Patient deleted successfully.");

      setShowDeleteModal(false);
      setDeletePatient(null);

      await fetchPatients();

      if (setRefreshPatients) {
        setRefreshPatients((prev) => !prev);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete patient."
      );
    }
  };

  // ============================
  // UI
  // ============================

  return (
    <div className="space-y-8">

      <div
        className={`p-8 rounded-2xl shadow-2xl border ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-300"
        }`}
      >
        {/* Header */}

        <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold text-cyan-400">
            Registered Patients
          </h2>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2" />

            <input
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500"
                  : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-cyan-500"
              }`}
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead>
              <tr
                className={
                  darkMode
                    ? "bg-slate-800 text-cyan-300"
                    : "bg-cyan-100 text-cyan-700"
                }
              >
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Age</th>
                <th className="p-4 text-left">Gender</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500"
                  >
                    Loading patients...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500"
                  >
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`cursor-pointer transition-all duration-300 ${
                      darkMode
                        ? "border-b border-slate-800 hover:bg-slate-800"
                        : "border-b border-gray-200 hover:bg-cyan-50"
                    }`}
                  >
                    <td className="p-4 font-medium">{patient.id}</td>

                    <td className="p-4 font-semibold">
                      {patient.full_name}
                    </td>

                    <td className="p-4">{patient.age}</td>

                    <td className="p-4">{patient.gender}</td>

                    <td className="p-4">{patient.phone}</td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        <button
                          title="View Patient"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient.id);
                          }}
                          className="p-2 text-blue-500 rounded-lg hover:bg-blue-100"
                        >
                          <FaEye size={16} />
                        </button>

                        <button
                          title="Edit Patient"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPatient(patient);

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          className="p-2 text-yellow-500 rounded-lg hover:bg-yellow-100"
                        >
                          <FaEdit size={16} />
                        </button>

                        <button
                          title="Delete Patient"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletePatient(patient);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-500 rounded-lg hover:bg-red-100"
                        >
                          <FaTrash size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* Footer */}

        <div
          className={`mt-5 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Total Patients:{" "}
          <span className="font-bold text-cyan-400">
            {filteredPatients.length}
          </span>
        </div>
      </div>

      {/* Patient Profile */}

      {selectedPatient && (
        <PatientProfile
          patientId={selectedPatient}
          darkMode={darkMode}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* Delete Modal */}

      <ConfirmModal
        isOpen={showDeleteModal}
        darkMode={darkMode}
        title="Delete Patient"
        message={
          deletePatient
            ? `Are you sure you want to permanently delete "${deletePatient.full_name}"? This action cannot be undone.`
            : ""
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletePatient(null);
        }}
        onConfirm={handleDeletePatient}
      />
    </div>
  );
}

export default PatientList;