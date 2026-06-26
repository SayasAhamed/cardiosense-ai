import { useState } from "react"
import axios from "axios"
import InputField from "./InputField"
import ConfirmModal from "./ConfirmModal"

function PredictionForm({ darkMode }) {

    const [formData, setFormData] = useState({

        age: "",
        sex: "Male",
        cp: "typical angina",
        trestbps: "",
        chol: "",
        fbs: false,
        restecg: "normal",
        thalch: "",
        exang: "No",
        oldpeak: "",
        slope: "upsloping",
        ca: "",
        thal: "normal"

    })

    const [result, setResult] = useState(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [loadingPrediction, setLoadingPrediction] = useState(false)

    // =========================================
    // HANDLE INPUT CHANGES
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData({

            ...formData,

            [name]: value

        })
    }

    // =========================================
    // RUN PREDICTION
    // =========================================

    const runPrediction = async () => {

        try {

            setLoadingPrediction(true)

            const response = await axios.post(

                "http://127.0.0.1:8000/predict/",

                {

                    patient_id: 1,

                    age: Number(formData.age),

                    sex: formData.sex,

                    cp: formData.cp,

                    trestbps: Number(formData.trestbps),

                    chol: Number(formData.chol),

                    fbs: formData.fbs,

                    restecg: formData.restecg,

                    thalch: Number(formData.thalch),

                    exang:
                        formData.exang === "Yes"
                            ? true
                            : false,

                    oldpeak: Number(formData.oldpeak),

                    slope: formData.slope,

                    ca: Number(formData.ca),

                    thal: formData.thal

                }
            )

            setResult(response.data)

            setLoadingPrediction(false)

            setShowConfirmModal(false)

        }

        catch (error) {

            setLoadingPrediction(false)

            console.log(error)

            alert("Prediction Failed")
        }
    }

    return (

        <div

            className={`

                p-8
                rounded-2xl
                shadow-2xl
                border

                ${darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-300"
                }

            `}
        >

            <h2 className="mb-8 text-3xl font-bold text-cyan-400">

                AI Prediction Form

            </h2>

            <form

                onSubmit={(e) => {

                    e.preventDefault()

                    setShowConfirmModal(true)
                }}

                className="grid grid-cols-1 gap-6 md:grid-cols-2"

            >

                <InputField
                    label="Age"
                    tooltipTitle="Patient Age"
                    tooltipDescription="Age is one of the strongest heart disease risk factors."
                    helperText="Typical Range: 20 - 80 Years"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter patient age"
                    darkMode={darkMode}
                />

                <InputField
                    label="Resting Blood Pressure"
                    tooltipTitle="Resting Blood Pressure"
                    tooltipDescription="High blood pressure increases strain on the heart."
                    helperText="Normal: Below 120 mmHg High: Above 140 mmHg"
                    type="number"
                    name="trestbps"
                    value={formData.trestbps}
                    onChange={handleChange}
                    placeholder="Enter blood pressure"
                    darkMode={darkMode}
                />

                <InputField
                    label="Serum Cholesterol (mg/dL)"
                    tooltipTitle="Serum Cholesterol"
                    tooltipDescription="High cholesterol increases heart disease risk."
                    helperText="Normal Range: Below 200 mg/dL"
                    type="number"
                    name="chol"
                    value={formData.chol}
                    onChange={handleChange}
                    placeholder="Enter cholesterol value"
                    darkMode={darkMode}
                />

                {/* SEX */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Sex
                    </label>

                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                    </select>

                </div>

                <InputField
                    label="Maximum Heart Rate"
                    tooltipTitle="Maximum Heart Rate"
                    tooltipDescription="Highest heart rate during exercise."
                    helperText="Typical Range: 70 - 202 bpm"
                    type="number"
                    name="thalch"
                    value={formData.thalch}
                    onChange={handleChange}
                    placeholder="Enter max heart rate"
                    darkMode={darkMode}
                />

                <InputField
                    label="Oldpeak (ST Depression)"
                    tooltipTitle="ST Depression"
                    tooltipDescription="Higher values may indicate coronary artery disease."
                    helperText="Normal Range: 0.0 - 1.0"
                    type="number"
                    step="0.1"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleChange}
                    placeholder="Enter ST Depression"
                    darkMode={darkMode}
                />

                <InputField
                    label="Major Vessels (CA)"
                    tooltipTitle="Major Blood Vessels"
                    tooltipDescription="Higher values may indicate artery blockage."
                    helperText="Typical Range: 0 - 3"
                    type="number"
                    name="ca"
                    value={formData.ca}
                    onChange={handleChange}
                    placeholder="Enter vessel count"
                    darkMode={darkMode}
                />

                {/* CHEST PAIN */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Chest Pain Type
                    </label>

                    <select
                        name="cp"
                        value={formData.cp}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="typical angina">
                            Typical Angina
                        </option>

                        <option value="atypical angina">
                            Atypical Angina
                        </option>

                        <option value="non-anginal">
                            Non-Anginal Pain
                        </option>

                        <option value="asymptomatic">
                            Asymptomatic
                        </option>

                    </select>

                </div>

                {/* FASTING BLOOD SUGAR */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Fasting Blood Sugar
                    </label>

                    <select
                        name="fbs"
                        value={formData.fbs.toString()}
                        onChange={(e) =>

                            setFormData({

                                ...formData,

                                fbs: e.target.value === "true"

                            })
                        }
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="false">
                            Below 120 mg/dL
                        </option>

                        <option value="true">
                            Above 120 mg/dL
                        </option>

                    </select>

                </div>

                {/* EXANG */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Exercise Induced Angina
                    </label>

                    <select
                        name="exang"
                        value={formData.exang}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="No">
                            No
                        </option>

                        <option value="Yes">
                            Yes
                        </option>

                    </select>

                </div>

                {/* REST ECG */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Resting ECG
                    </label>

                    <select
                        name="restecg"
                        value={formData.restecg}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="normal">
                            Normal
                        </option>

                        <option value="st-t abnormality">
                            ST-T Wave Abnormality
                        </option>

                        <option value="lv hypertrophy">
                            Left Ventricular Hypertrophy
                        </option>

                    </select>

                </div>

                {/* THAL */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Thalassemia Test
                    </label>

                    <select
                        name="thal"
                        value={formData.thal}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="normal">
                            Normal
                        </option>

                        <option value="fixed defect">
                            Fixed Defect
                        </option>

                        <option value="reversable defect">
                            Reversable Defect
                        </option>

                    </select>

                </div>

                {/* SLOPE */}

                <div>

                    <label className="block mb-2 font-semibold">
                        ST Segment Slope
                    </label>

                    <select
                        name="slope"
                        value={formData.slope}
                        onChange={handleChange}
                        className={`
                            w-full
                            p-4
                            rounded-xl
                            outline-none
                            transition

                            ${
                                darkMode
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-200 text-slate-900"
                            }
                        `}
                    >

                        <option value="upsloping">
                            Upsloping
                        </option>

                        <option value="flat">
                            Flat
                        </option>

                        <option value="downsloping">
                            Downsloping
                        </option>

                    </select>

                </div>

                <button

                    type="submit"

                    className="px-8 py-4 text-lg font-bold text-white transition shadow-xl rounded-2xl bg-cyan-500 hover:bg-cyan-600"

                >

                    {

                        loadingPrediction

                            ? "Predicting..."

                            : "Run AI Prediction"

                    }

                </button>

            </form>

            {

                result && (

                    <div

                        className={`

                            mt-10
                            p-6
                            rounded-2xl

                            ${darkMode
                                ? "bg-slate-800"
                                : "bg-gray-200"
                            }

                        `}

                    >

                        <h3 className="mb-4 text-2xl font-bold text-cyan-400">

                            Prediction Result

                        </h3>

                        <p className="text-lg">

                            Risk Level:

                            <span className="ml-2 font-bold">

                                {result.risk_level}

                            </span>

                        </p>

                        <p className="mt-2 text-lg">

                            Confidence:

                            <span className="ml-2 font-bold">

                                {result.confidence_score}%

                            </span>

                        </p>

                    </div>

                )

            }

            <ConfirmModal

                isOpen={showConfirmModal}

                title="Run AI Prediction?"

                message="Please confirm patient medical information before generating the AI prediction result."

                confirmText="Run Prediction"

                cancelText="Cancel"

                onConfirm={runPrediction}

                onCancel={() => setShowConfirmModal(false)}

                darkMode={darkMode}

                type="primary"

            />

        </div>
    )
}

export default PredictionForm