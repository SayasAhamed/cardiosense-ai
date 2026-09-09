import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";

import {
  FaHeartbeat,
  FaBrain,
  FaUserPlus,
  FaSearch,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import MedicalTooltip from "./MedicalTooltip";

const API = "http://127.0.0.1:8000";

// =====================================================
// MEDICAL FIELD INFORMATION
// =====================================================

const fieldInfo = {
  age: {
    title: "Age",
    description: "Patient's age in completed years.",
    range: "18 – 100 Years",
  },

  sex: {
    title: "Sex",
    description: "Biological sex used by the trained AI model.",
    range: "Male / Female",
  },

  chest_pain_type: {
    title: "Chest Pain Type",
    description:
      "Categorizes chest pain symptoms experienced by the patient.",
    range: "Typical Angina • Atypical Angina • Non-anginal • Asymptomatic",
  },

  resting_bp: {
    title: "Resting Blood Pressure",
    description:
      "Blood pressure measured while resting before exercise testing.",
    range: "80 – 220 mmHg",
  },

  cholesterol: {
    title: "Serum Cholesterol",
    description:
      "Cholesterol level measured from blood sample.",
    range: "100 – 600 mg/dL",
  },

  fasting_bs: {
    title: "Fasting Blood Sugar",
    description:
      "Fasting blood sugar above 120 mg/dL indicates elevated glucose.",
    range: "Yes / No",
  },

  resting_ecg: {
    title: "Resting ECG",
    description:
      "Electrocardiogram result while patient is at rest.",
    range: "Normal • ST-T Abnormality • LV Hypertrophy",
  },

  max_hr: {
    title: "Maximum Heart Rate",
    description:
      "Highest heart rate achieved during exercise testing.",
    range: "60 – 220 bpm",
  },

  exercise_angina: {
    title: "Exercise-Induced Angina",
    description:
      "Chest pain triggered during physical exercise.",
    range: "Yes / No",
  },

  oldpeak: {
    title: "Old Peak",
    description:
      "ST depression induced by exercise compared to rest ECG.",
    range: "0.0 – 6.5",
  },

  st_slope: {
    title: "ST Segment Slope",
    description:
      "Slope of the ST segment during peak exercise ECG.",
    range: "Upsloping • Flat • Downsloping",
  },
};

// =====================================================
// COMPONENT
// =====================================================

function PredictionForm({ darkMode }) {
  // =========================================
  // PATIENT STATES
  // =========================================

  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

  // Stores the ID of a newly registered patient
  const [registeredPatientId, setRegisteredPatientId] = useState(null);

  const [existingPatient, setExistingPatient] = useState(null);
  const [patientExists, setPatientExists] = useState(false);

  const [newPatient, setNewPatient] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  // =========================================
  // FORM STATES
  // =========================================

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    chest_pain_type: "",
    resting_bp: "",
    cholesterol: "",
    fasting_bs: "",
    resting_ecg: "",
    max_hr: "",
    exercise_angina: "",
    oldpeak: "",
    st_slope: "",
    ca: "0",        
  });

  // =========================================
  // RESULT STATES
  // =========================================

  const [prediction, setPrediction] = useState(null);
  const [shapData, setShapData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showRegisterPrompt, setShowRegisterPrompt] =
    useState(false);

  const [errors, setErrors] = useState({});
  

  // =========================================
  // FETCH REGISTERED PATIENTS
  // =========================================

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API}/patients/`);
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================
  // FILTERED PATIENT LIST
  // =========================================

  const filteredPatients = patients.filter((patient) => {
    return (
      patient.full_name
        .toLowerCase()
        .includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch)
    );
  });

  // =========================================
  // VALIDATE FORM
  // =========================================

  const validateForm = () => {
    const newErrors = {};

    if (!newPatient.full_name.trim()) {
      newErrors.patient_name = "Patient name is required.";
    }

    if (!newPatient.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age =
        "Age must be between 18 and 100 years.";
    }

    if (!formData.sex) {
      newErrors.sex = "Please select patient sex.";
    }

    if (!formData.chest_pain_type) {
      newErrors.chest_pain_type =
        "Select chest pain type.";
    }

    if (
      formData.resting_bp === "" ||
      formData.resting_bp < 80 ||
      formData.resting_bp > 220
    ) {
      newErrors.resting_bp =
        "Resting BP must be between 80 and 220 mmHg.";
    }

    if (
      formData.cholesterol === "" ||
      formData.cholesterol < 100 ||
      formData.cholesterol > 600
    ) {
      newErrors.cholesterol =
        "Cholesterol must be between 100 and 600 mg/dL.";
    }

    if (formData.fasting_bs === "") {
      newErrors.fasting_bs =
        "Select fasting blood sugar status.";
    }

    if (!formData.resting_ecg) {
      newErrors.resting_ecg =
        "Select resting ECG result.";
    }

    if (
      formData.max_hr === "" ||
      formData.max_hr < 60 ||
      formData.max_hr > 220
    ) {
      newErrors.max_hr =
        "Maximum HR must be between 60 and 220 bpm.";
    }

    if (formData.exercise_angina === "") {
      newErrors.exercise_angina =
        "Select exercise-induced angina.";
    }

    if (
      formData.oldpeak === "" ||
      formData.oldpeak < 0 ||
      formData.oldpeak > 6.5
    ) {
      newErrors.oldpeak =
        "Old Peak must be between 0.0 and 6.5.";
    }

    if (!formData.st_slope) {
      newErrors.st_slope = "Select ST slope.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================
  // CLINICAL INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================================
  // NEW PATIENT INPUT CHANGE
  // =========================================

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;

    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "full_name" &&
      errors.patient_name
    ) {
      setErrors((prev) => ({
        ...prev,
        patient_name: "",
      }));
    }

    if (name === "phone" && errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  // =========================================
  // SELECT REGISTERED PATIENT
  // =========================================

    const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setRegisteredPatientId(patient.id);
    setExistingPatient(patient);
    setPatientExists(true);

    setPatientSearch(patient.full_name);

    setNewPatient({
        full_name: patient.full_name,
        phone: patient.phone,
        address: patient.address || "",
    });

    setFormData((prev) => ({
        ...prev,
        age: patient.age,
        sex: patient.gender === "Male" ? "1" : "0",
    }));
    };

  // =========================================
  // CLEAR PATIENT SELECTION
  // =========================================

    const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setRegisteredPatientId(null);
    setExistingPatient(null);
    setPatientExists(false);
    };

    // =========================================
    // REGISTER NEW PATIENT
    // =========================================

    const registerPatient = async () => {
    const payload = {
        full_name: newPatient.full_name.trim(),
        age: Number(formData.age),
        gender: formData.sex === "1" ? "Male" : "Female",
        phone: newPatient.phone.trim(),
        address: newPatient.address.trim(),
    };

    console.log("Register Payload:", payload);

    const response = await axios.post(`${API}/patients/`, payload);

    // Save patient ID separately
    setRegisteredPatientId(response.data.id);

    // Save the FULL patient object
    setSelectedPatient(response.data);
    setExistingPatient(response.data);
    setPatientExists(true);
    setShowRegisterPrompt(false);

    await fetchPatients();

    // Return newly created patient object
    return response.data;
    };

    // =========================================
    // PREDICT HEART DISEASE
    // =========================================

    const handlePredict = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        const firstError = document.querySelector(".border-red-500");
        firstError?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        });
        firstError?.focus();
        return;
    }

    if (
        !selectedPatient &&
        !registeredPatientId &&
        newPatient.full_name.trim() === ""
    ) {
        alert("Please select or enter a patient.");
        return;
    }

    setLoading(true);

    try {
        // -----------------------------
        // Get Patient ID
        // -----------------------------
        
        
        // Works whether selectedPatient is an object or just an ID
        let patientId =
        typeof selectedPatient === "object"
            ? selectedPatient?.id
            : selectedPatient || registeredPatientId;

        // Register patient automatically if needed
        if (!patientId) {
                const patient = await registerPatient();

                if (!patient || !patient.id) {
                    alert("Patient registration failed. Please try again.");
                    setLoading(false);
                    return;
                }

            patientId = patient.id;
        }

        if (!patientId) {
        alert("Patient registration failed.");
        return;
        }

        console.log("Using Patient ID:", patientId);

        // -----------------------------
        // Prediction Payload
        // -----------------------------

        const payload = {
        patient_id: patientId,

        age: Number(formData.age),
        trestbps: Number(formData.resting_bp),
        chol: Number(formData.cholesterol),
        thalch: Number(formData.max_hr),
        oldpeak: Number(formData.oldpeak),

        ca: Number(formData.ca),

        fbs: formData.fasting_bs === "1",
        exang: formData.exercise_angina === "1",

        sex: formData.sex === "1" ? "Male" : "Female",

        cp:
            formData.chest_pain_type === "0"
            ? "typical angina"
            : formData.chest_pain_type === "1"
            ? "atypical angina"
            : formData.chest_pain_type === "2"
            ? "non-anginal"
            : "asymptomatic",

        restecg:
            formData.resting_ecg === "0"
            ? "normal"
            : formData.resting_ecg === "1"
            ? "st-t abnormality"
            : "left ventricular hypertrophy",

        slope:
            formData.st_slope === "0"
            ? "upsloping"
            : formData.st_slope === "1"
            ? "flat"
            : "downsloping",

        // Required by your ML schema
        thal: "reversable defect",
        };

        console.log("Prediction Payload:", payload);

        // -----------------------------
        // AI Prediction
        // -----------------------------

        const predictionRes = await axios.post(
            `${API}/predict/`,
            payload,
            {
                headers: {
                "Content-Type": "application/json",
                },
            }
            );

        setPrediction(predictionRes.data);

        // -----------------------------
        // SHAP Explainability
        // -----------------------------

        try {
            const shapRes = await axios.post(
                `${API}/xai/`,
                payload,
                {
                    headers: {
                    "Content-Type": "application/json",
                    },
                }
                );

                setShapData(
                shapRes.data.feature_importance ||
                shapRes.data.features ||
                []
            );
        
        } catch (shapError) {
        console.log("SHAP Error:", shapError);
        setShapData([]);
        }

        if (!patientExists) {
        setShowRegisterPrompt(true);
        }

    } catch (error) {
        console.error("Prediction Error:", error);

        if (error.response) {
        console.log("Backend Response:", error.response.data);

        alert(
            JSON.stringify(error.response.data.detail || error.response.data, null, 2)
        );
        } else {
        alert("Prediction failed. Please try again.");
        }

    } finally {
        setLoading(false);
    }
    };

    
  // =========================================
  // RESET FORM
  // =========================================

  const resetPrediction = () => {
    setPrediction(null);
    setShapData([]);
    setErrors({});
    clearSelectedPatient();

    setNewPatient({
      full_name: "",
      phone: "",
      address: "",
    });

    setFormData({
      age: "",
      sex: "",
      chest_pain_type: "",
      resting_bp: "",
      cholesterol: "",
      fasting_bs: "",
      resting_ecg: "",
      max_hr: "",
      exercise_angina: "",
      oldpeak: "",
      st_slope: "",
      ca: "0",          
    });
  };

  // =========================================
  // INPUT STYLE
  // =========================================

  const inputStyle = `
    w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200
    ${
      darkMode
        ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        : "bg-white border-gray-300 text-black focus:border-cyan-500"
    }
  `;

  // =========================================
  // SHAP FEATURE DISPLAY NAMES
  // =========================================

  const featureNames = {
    cp: "Chest Pain Type",
    chol: "Serum Cholesterol",
    trestbps: "Resting Blood Pressure",
    thalch: "Maximum Heart Rate",
    oldpeak: "ST Depression (Oldpeak)",
    exang: "Exercise-Induced Angina",
    restecg: "Resting ECG Result",
    slope: "ST Segment Slope",
    ca: "Major Coronary Vessels (CA)",
    thal: "Thalassemia",
    sex: "Gender",
    age: "Age",
    fbs: "Fasting Blood Sugar",
  };

  
  // =========================================
  // START JSX
  // =========================================

  return (
    <div className="space-y-8">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        className={`rounded-3xl p-8 shadow-xl border ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <FaHeartbeat className="text-5xl text-red-500" />

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              Heart Disease Severity Prediction
            </h2>

            <p
              className={
                darkMode ? "text-gray-400" : "text-gray-600"
              }
            >
              Clinical prediction using XGBoost AI with SHAP Explainable AI.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MAIN FORM */}
      {/* ========================================= */}

      <form
        onSubmit={handlePredict}
        className="space-y-8"
      >

        {/* ========================================= */}
        {/* PATIENT INFORMATION */}
        {/* ========================================= */}

        <div
          className={`rounded-3xl border p-8 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="mb-6 text-2xl font-bold text-cyan-400">
            Patient Information
          </h3>

          {/* Search Registered Patient */}

          <div className="mb-8">
            <label className="block mb-2 font-semibold">
              Search Registered Patient
            </label>

            <div className="relative">
              <FaSearch className="absolute text-gray-400 left-4 top-4" />

              <input
                type="text"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  clearSelectedPatient();
                }}
                placeholder="Search patient by name or phone..."
                className={`${inputStyle} pl-11`}
              />
            </div>

            {patientSearch &&
              filteredPatients.length > 0 &&
              !patientExists && (
                <div
                  className={`mt-2 rounded-xl border max-h-52 overflow-y-auto ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className={`w-full px-4 py-3 text-left border-b last:border-b-0 transition ${
                        darkMode
                          ? "border-slate-700 hover:bg-slate-700"
                          : "border-gray-200 hover:bg-cyan-50"
                      }`}
                    >
                      <div className="font-semibold">
                        {patient.full_name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            {patientExists && (
              <div className="flex items-center gap-3 p-4 mt-4 border border-green-500 rounded-xl bg-green-500/10">
                <FaCheckCircle className="text-xl text-green-500" />

                <div>
                  <p className="font-semibold text-green-500">
                    Registered Patient Selected
                  </p>

                  <p className="text-sm">
                    {existingPatient.full_name} • {existingPatient.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Patient Inputs */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* FULL NAME */}

            <div>
              <label className="block mb-2 font-semibold">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="full_name"
                value={newPatient.full_name}
                onChange={handleNewPatientChange}
                placeholder="Enter patient full name"
                className={`${inputStyle} ${
                  errors.patient_name
                    ? "border-red-500 ring-1 ring-red-400"
                    : ""
                }`}
              />

              {errors.patient_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.patient_name}
                </p>
              )}
            </div>

            {/* PHONE */}

            <div>
              <label className="block mb-2 font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="phone"
                value={newPatient.phone}
                onChange={handleNewPatientChange}
                placeholder="0771234567"
                className={`${inputStyle} ${
                  errors.phone
                    ? "border-red-500 ring-1 ring-red-400"
                    : ""
                }`}
              />

              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                Address
              </label>

              <textarea
                name="address"
                rows="2"
                value={newPatient.address}
                onChange={handleNewPatientChange}
                placeholder="Patient address (optional)"
                className={inputStyle}
              />
            </div>

            {/* AGE */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Age <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.age}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                placeholder="18 - 100 Years"
                className={`${inputStyle} ${
                  errors.age
                    ? "border-red-500 ring-1 ring-red-400"
                    : ""
                }`}
              />

              {errors.age && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.age}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Valid Range: 18–100 Years
              </p>
            </div>

            {/* SEX */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Sex <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.sex}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.sex
                    ? "border-red-500 ring-1 ring-red-400"
                    : ""
                }`}
              >
                <option value="">Select Sex</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>

              {errors.sex && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.sex}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* CLINICAL INFORMATION */}
        {/* ========================================= */}

        <div
          className={`rounded-3xl border p-8 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="mb-8 text-2xl font-bold text-cyan-400">
            Clinical Parameters
          </h3>

          <div className="grid gap-7 md:grid-cols-2">

            {/* CHEST PAIN TYPE */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Chest Pain Type
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.chest_pain_type}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="chest_pain_type"
                value={formData.chest_pain_type}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.chest_pain_type
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              >
                <option value="">Select Chest Pain Type</option>
                <option value="0">Typical Angina</option>
                <option value="1">Atypical Angina</option>
                <option value="2">Non-anginal Pain</option>
                <option value="3">Asymptomatic</option>
              </select>

              {errors.chest_pain_type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.chest_pain_type}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Typical Angina usually indicates higher cardiac risk.
              </p>
            </div>

            {/* RESTING BLOOD PRESSURE */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Resting Blood Pressure
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.resting_bp}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <input
                type="number"
                name="resting_bp"
                min="80"
                max="220"
                value={formData.resting_bp}
                onChange={handleChange}
                placeholder="80 - 220 mmHg"
                className={`${inputStyle} ${
                  errors.resting_bp
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              />

              {errors.resting_bp && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.resting_bp}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Normal adult resting BP is around 90–120 mmHg systolic.
              </p>
            </div>

            {/* CHOLESTEROL */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Serum Cholesterol
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.cholesterol}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <input
                type="number"
                name="cholesterol"
                min="100"
                max="600"
                value={formData.cholesterol}
                onChange={handleChange}
                placeholder="100 - 600 mg/dL"
                className={`${inputStyle} ${
                  errors.cholesterol
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              />

              {errors.cholesterol && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.cholesterol}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Healthy range is generally below 200 mg/dL.
              </p>
            </div>

            {/* FASTING BLOOD SUGAR */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Fasting Blood Sugar
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.fasting_bs}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="fasting_bs"
                value={formData.fasting_bs}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.fasting_bs
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              >
                <option value="">Select</option>
                <option value="1">Yes (Greater than 120 mg/dL)</option>
                <option value="0">No</option>
              </select>

              {errors.fasting_bs && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fasting_bs}
                </p>
              )}
            </div>

            {/* RESTING ECG */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Resting ECG Result
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.resting_ecg}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="resting_ecg"
                value={formData.resting_ecg}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.resting_ecg
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              >
                <option value="">Select ECG Result</option>

                <option value="0">Normal</option>

                <option value="1">
                  ST-T Wave Abnormality
                </option>

                <option value="2">
                  Left Ventricular Hypertrophy
                </option>
              </select>

              {errors.resting_ecg && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.resting_ecg}
                </p>
              )}
            </div>

            {/* MAJOR VESSELS (CA) */}
            
            <div className="space-y-2">
              <label className="font-semibold text-cyan-500">
                Major Vessels (CA) *
              </label>

              <select
                name="ca"
                value={formData.ca}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="0">Unknown / 0 (Default)</option>
                <option value="1">1 Major Vessel</option>
                <option value="2">2 Major Vessels</option>
                <option value="3">3 Major Vessels</option>
                <option value="4">4 Major Vessels</option>
              </select>

              <p className="text-xs text-gray-500">
                Number of major coronary vessels detected during fluoroscopy.
              </p>
            </div>

            {/* MAX HEART RATE */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Maximum Heart Rate
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.max_hr}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <input
                type="number"
                name="max_hr"
                min="60"
                max="220"
                value={formData.max_hr}
                onChange={handleChange}
                placeholder="60 - 220 bpm"
                className={`${inputStyle} ${
                  errors.max_hr
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              />

              {errors.max_hr && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.max_hr}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Expected exercise HR varies by age.
              </p>
            </div>

                        {/* EXERCISE INDUCED ANGINA */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Exercise-Induced Angina
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.exercise_angina}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="exercise_angina"
                value={formData.exercise_angina}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.exercise_angina
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>

              {errors.exercise_angina && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.exercise_angina}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Indicates chest pain triggered during physical activity.
              </p>
            </div>

            {/* OLD PEAK */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Old Peak
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.oldpeak}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <input
                type="number"
                name="oldpeak"
                min="0"
                max="6.5"
                step="0.1"
                value={formData.oldpeak}
                onChange={handleChange}
                placeholder="0.0 – 6.5"
                className={`${inputStyle} ${
                  errors.oldpeak
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              />

              {errors.oldpeak && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.oldpeak}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                ST depression measured after exercise.
              </p>
            </div>

            {/* ST SLOPE */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                ST Segment Slope
                <span className="text-red-500">*</span>

                <MedicalTooltip {...fieldInfo.st_slope}>
                  <FaInfoCircle className="cursor-pointer text-cyan-400" />
                </MedicalTooltip>
              </label>

              <select
                name="st_slope"
                value={formData.st_slope}
                onChange={handleChange}
                className={`${inputStyle} ${
                  errors.st_slope
                    ? "border-red-500 ring-red-400 ring-1"
                    : ""
                }`}
              >
                <option value="">Select ST Slope</option>
                <option value="0">Upsloping</option>
                <option value="1">Flat</option>
                <option value="2">Downsloping</option>
              </select>

              {errors.st_slope && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.st_slope}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Flat or downsloping ST segments usually indicate higher risk.
              </p>
            </div>

          </div>

          {/* ========================================= */}
          {/* PREDICT BUTTON */}
          {/* ========================================= */}

          <div className="pt-8 mt-10 border-t border-slate-700">

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full rounded-2xl py-4 text-lg font-bold text-white
                transition-all duration-300
                ${
                  loading
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-cyan-500 hover:bg-cyan-600 hover:scale-[1.01]"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></span>

                  AI Model Analyzing Patient...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <FaHeartbeat />

                  Predict Heart Disease Severity
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={resetPrediction}
              className="w-full py-3 mt-4 font-semibold transition border border-gray-400 rounded-xl hover:bg-gray-500/10"
            >
              Reset Prediction Form
            </button>

          </div>

        </div>

      </form>

      {/* ========================================= */}
      {/* REGISTER PATIENT POPUP */}
      {/* ========================================= */}

      {showRegisterPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${
              darkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <FaUserPlus className="text-3xl text-cyan-500" />

              <h3 className="text-2xl font-bold">
                Register Patient?
              </h3>
            </div>

            <p className="mb-6 text-sm leading-7 text-gray-500">
              This patient isn't registered in CardioSense AI.
              Prediction completed successfully.

              Would you like to save this patient for future
              predictions and history?
            </p>

            <div className="flex gap-3">
              <button
                onClick={registerPatient}
                className="flex-1 py-3 font-semibold text-white rounded-xl bg-cyan-500 hover:bg-cyan-600"
              >
                Register
              </button>

              <button
                onClick={() => setShowRegisterPrompt(false)}
                className="flex-1 py-3 font-semibold border rounded-xl hover:bg-gray-500/10"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* AI PREDICTION RESULT */}
      {/* ========================================= */}

      {prediction && (
        <div
          className={`rounded-3xl border p-8 shadow-xl ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <FaBrain className="text-5xl text-purple-500" />

            <div>
              <h2 className="text-3xl font-bold text-purple-500">
                AI Prediction Result
              </h2>

              <p className="text-sm text-gray-500">
                XGBoost Heart Disease Severity Prediction
              </p>
            </div>
          </div>

          {/* Risk Badge */}

          <div className="flex flex-wrap items-center justify-between gap-5 p-6 mb-8 border rounded-2xl border-cyan-500/20 bg-cyan-500/10">

            <div>
              <p className="mb-2 text-sm tracking-widest uppercase text-cyan-400">
                Predicted Severity
              </p>

              <span
                className={`rounded-full px-5 py-2 text-lg font-bold ${
                  prediction.risk_level === "No Risk"
                    ? "bg-green-500 text-white"
                    : prediction.risk_level === "Moderate Risk"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {prediction.risk_level}
              </span>
            </div>

            <div className="text-center">
              <p className="mb-2 text-sm tracking-wide uppercase text-cyan-400">
                Confidence Score
              </p>

            <h1 className="text-5xl font-bold text-cyan-400">
              {((prediction?.confidence_score ?? 0) * 100).toFixed(2)}%
            </h1>
            </div>

          </div>

          {/* Probability Bars */}

          <div className="space-y-5">

            <h3 className="text-xl font-bold text-cyan-400">
              Prediction Probabilities
            </h3>

            {[
              {
                label: "No Risk Probability",
                value: prediction?.no_risk_probability || 0,
                color: "bg-green-500",
              },
              {
                label: "Moderate Risk Probability",
                value: prediction?.moderate_risk_probability || 0,
                color: "bg-yellow-500",
              },
              {
                label: "High Risk Probability",
                value: prediction?.high_risk_probability || 0,
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{item.label}</span>
                  <span>{(item.value * 100).toFixed(2)}%</span>
                </div>

                <div className="h-3 overflow-hidden bg-gray-300 rounded-full dark:bg-slate-700">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${item.value * 100}%` }}
                  />
                </div>
              </div>
            ))}

          </div>

          {/* Interpretation */}

          <div
            className={`mt-8 rounded-2xl border-l-4 p-6 ${
              prediction.risk_level === "No Risk"
                ? "border-green-500 bg-green-500/10"
                : prediction.risk_level === "Moderate Risk"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-red-500 bg-red-500/10"
            }`}
          >
            <h4 className="mb-3 text-lg font-bold">
              Clinical Interpretation
            </h4>

            {prediction.risk_level === "No Risk" && (
              <p>
                The AI model predicts a low probability of significant heart
                disease. Continue routine monitoring and healthy lifestyle
                management.
              </p>
            )}

            {prediction.risk_level === "Moderate Risk" && (
              <p>
                The AI model predicts moderate cardiovascular risk. Further
                clinical evaluation, ECG review, laboratory investigations,
                and physician consultation are recommended.
              </p>
            )}

            {prediction.risk_level === "High Risk" && (
              <p>
                The AI model predicts a high probability of heart disease.
                Immediate medical assessment, diagnostic investigations,
                and specialist referral are strongly recommended.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SHAP EXPLAINABLE AI */}
      {/* ========================================= */}

      {prediction && shapData.length > 0 && (
        <div
          className={`rounded-3xl border p-8 shadow-xl ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <FaBrain className="text-5xl text-pink-500" />

            <div>
              <h2 className="text-3xl font-bold text-pink-500">
                SHAP Explainable AI
              </h2>

              <p className="text-sm text-gray-500">
                Most influential clinical features used by the AI model.
              </p>
            </div>
          </div>

          {/* SHAP Legend */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Increases Heart Disease Risk
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Reduces Heart Disease Risk
              </span>
            </div>
          </div>
          

          <div className="space-y-6">
            {Array.isArray(shapData) &&
            shapData.map((feature, index) => (
              
              <div key={index} className="space-y-2">

                <div className="flex justify-between font-medium">
                  <span>{featureNames[feature.feature] || feature.feature}</span>

                  <span
                    className={
                      feature.value >= 0
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {feature.value >= 0 ? "+" : ""}
                    {feature.value.toFixed(3)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden bg-gray-300 rounded-full dark:bg-slate-700">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      feature.value >= 0
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  style={{
                    width: `${
                      (Math.abs(feature.value) /
                        Math.max(...shapData.map((f) => Math.abs(f.value)))) *
                      100
                    }%`,
                  }}
                  />

                </div>

              </div>
            ))}
          </div>

          <div className="p-5 mt-8 text-sm leading-7 rounded-2xl bg-pink-500/10">
            SHAP (SHapley Additive exPlanations) explains how each clinical
            parameter influenced the AI prediction. Positive values increased
            heart disease risk, while negative values reduced the predicted
            risk.
          </div>
        </div>
      )}

    </div>
  );
}

export default PredictionForm;