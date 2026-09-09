import { useEffect, useState } from "react";
import axios from "axios";

function PatientForm({
  darkMode,
  editingPatient,
  setEditingPatient,
  onPatientAdded,
}) {
  // ====================================
  // FORM STATE
  // ====================================

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // ====================================
  // LOAD EDITING PATIENT
  // ====================================

  useEffect(() => {
    if (editingPatient) {
      setFormData({
        full_name: editingPatient.full_name || "",
        age: editingPatient.age || "",
        gender: editingPatient.gender || "Male",
        phone: editingPatient.phone || "",
        address: editingPatient.address || "",
      });

      // Scroll to form when editing
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [editingPatient]);

  // ====================================
  // HANDLE INPUT CHANGE
  // ====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================
  // CLEAR FORM
  // ====================================

  const clearForm = () => {
    setFormData({
      full_name: "",
      age: "",
      gender: "Male",
      phone: "",
      address: "",
    });

    setEditingPatient(null);
  };

  // ====================================
  // SUBMIT FORM
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.age ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      // UPDATE PATIENT
      if (editingPatient) {
        await axios.put(
          `http://127.0.0.1:8000/patients/${editingPatient.id}`,
          formData
        );

        alert("Patient updated successfully.");
      }

      // CREATE PATIENT
      else {
        await axios.post(
          "http://127.0.0.1:8000/patients/",
          formData
        );

        alert("Patient registered successfully.");
      }

      clearForm();

      onPatientAdded();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Failed to save patient."
      );
    }

    setLoading(false);
  };

  return (
    <div
      className={`rounded-2xl border shadow-xl p-8 ${
        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-gray-300"
      }`}
    >
      {/* TITLE */}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-cyan-400">
          {editingPatient
            ? "Edit Patient"
            : "Patient Registration"}
        </h2>

        {editingPatient && (
          <span className="px-3 py-1 text-sm font-bold text-yellow-400 bg-yellow-100 rounded-full">
            EDIT MODE
          </span>
        )}
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ROW 1 */}

        <div className="grid gap-5 md:grid-cols-2">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Patient Full Name"
            className={`p-4 rounded-xl outline-none border transition ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500"
                : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-cyan-500"
            }`}
          />

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className={`p-4 rounded-xl outline-none border transition ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500"
                : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-cyan-500"
            }`}
          />
        </div>

        {/* ROW 2 */}

        <div className="grid gap-5 md:grid-cols-2">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`p-4 rounded-xl outline-none border transition ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
                : "bg-gray-100 border-gray-300 text-black focus:border-cyan-500"
            }`}
          >
            <option value="Male">Male</option>

            <option value="Female">Female</option>

            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className={`p-4 rounded-xl outline-none border transition ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500"
                : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-cyan-500"
            }`}
          />
        </div>

        {/* ADDRESS */}

        <textarea
          rows={5}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className={`w-full p-4 rounded-xl outline-none border transition resize-none ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500"
              : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-cyan-500"
          }`}
        />

        {/* BUTTONS */}

        <div className="flex flex-col gap-3 md:flex-row">
          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 font-bold text-white transition bg-cyan-500 rounded-xl hover:bg-cyan-600 disabled:bg-cyan-300"
          >
            {loading
              ? editingPatient
                ? "Updating..."
                : "Registering..."
              : editingPatient
              ? "Update Patient"
              : "Register Patient"}
          </button>

          {/* CANCEL EDIT */}

          {editingPatient && (
            <button
              type="button"
              onClick={clearForm}
              className="flex-1 py-4 font-bold text-white transition bg-gray-500 rounded-xl hover:bg-gray-600"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PatientForm;