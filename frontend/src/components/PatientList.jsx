import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

import ConfirmModal from "./ConfirmModal";
import PatientProfile from "./PatientProfile";

function PatientList({
  darkMode,
  refreshPatients,
  setRefreshPatients,
  setEditingPatient,
}) {
  // ====================================
  // STATES
  // ====================================

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [deletePatient, setDeletePatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ====================================
  // FETCH PATIENTS
  // ====================================

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/patients/"
      );

      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // ====================================
  // LOAD DATA
  // ====================================

  useEffect(() => {
    fetchPatients();
  }, [refreshPatients]);

  // ====================================
  // SEARCH (Local Filter)
  // ====================================

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

  // ====================================
  // DELETE PATIENT
  // ====================================

  const handleDeletePatient = async () => {
    if (!deletePatient) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/patients/${deletePatient.id}`
      );

      setShowDeleteModal(false);
      setDeletePatient(null);

      await fetchPatients();

      if (setRefreshPatients) {
        setRefreshPatients((prev) => !prev);
      }

      alert("Patient deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete patient."
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* ==================================== */}
      {/* PATIENT TABLE */}
      {/* ==================================== */}

      <div
        className={`p-8 rounded-2xl shadow-2xl border ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-300"
        }`}
      >
        {/* HEADER */}

        <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold text-cyan-400">
            Registered Patients
          </h2>

          {/* SEARCH */}

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

        {/* TABLE */}

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
              {filteredPatients.length === 0 ? (
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

                    {/* ACTIONS */}

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        {/* VIEW */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient.id);
                          }}
                          title="View Patient"
                          className="p-2 text-blue-500 rounded-lg hover:bg-blue-100"
                        >
                          <FaEye size={16} />
                        </button>

                        {/* EDIT */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPatient(patient);

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          title="Edit Patient"
                          className="p-2 text-yellow-500 rounded-lg hover:bg-yellow-100"
                        >
                          <FaEdit size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletePatient(patient);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Patient"
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

        {/* FOOTER */}

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

      {/* ==================================== */}
      {/* PATIENT PROFILE */}
      {/* ==================================== */}

      {selectedPatient && (
       <PatientProfile
           patientId={selectedPatient}
           darkMode={darkMode}
           onClose={() => setSelectedPatient(null)}
       />
       )}

      {/* ==================================== */}
      {/* DELETE CONFIRM MODAL */}
      {/* ==================================== */}

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