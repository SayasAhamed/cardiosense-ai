import { useState } from "react"
import axios from "axios"
import MedicalTooltip from "./MedicalTooltip"

function PatientForm({

    darkMode,

    onPatientAdded

}) {

    const [patientData, setPatientData] = useState({

        full_name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: ""

    })

    const handleChange = (e) => {

        const { name, value } = e.target

        setPatientData({

            ...patientData,
            [name]: value

        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            await axios.post(

                "http://127.0.0.1:8000/patients/",
                patientData

            )

            alert("Patient Added Successfully")

            // RESET FORM

            setPatientData({

                full_name: "",
                age: "",
                gender: "Male",
                phone: "",
                address: ""

            })

            // REFRESH PATIENT LIST

            if (onPatientAdded) {

                onPatientAdded()

            }

        } catch (error) {

            console.log(error)

            alert("Failed to add patient")
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

                Patient Registration

            </h2>

            <form

                onSubmit={handleSubmit}

                className="space-y-6"
            >

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* FULL NAME */}

                    <input

                        type="text"

                        name="full_name"

                        placeholder="Patient Full Name"

                        value={patientData.full_name}

                        onChange={handleChange}

                        required

                        className={`

                            p-5
                            rounded-xl
                            outline-none

                            ${darkMode

                                ? "bg-slate-800 text-white"

                                : "bg-gray-200 text-slate-900"

                            }

                        `}
                    />

                    {/* AGE */}

                    <input

                        type="number"

                        name="age"

                        placeholder="Age"

                        value={patientData.age}

                        onChange={handleChange}

                        required

                        className={`

                            p-5
                            rounded-xl
                            outline-none

                            ${darkMode

                                ? "bg-slate-800 text-white"

                                : "bg-gray-200 text-slate-900"

                            }

                        `}
                    />

                    {/* GENDER */}

                    <select

                        name="gender"

                        value={patientData.gender}

                        onChange={handleChange}

                        className={`

                            p-5
                            rounded-xl
                            outline-none

                            ${darkMode

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

                    {/* PHONE */}

                    <input

                        type="text"

                        name="phone"

                        placeholder="Phone Number"

                        value={patientData.phone}

                        onChange={handleChange}

                        required

                        className={`

                            p-5
                            rounded-xl
                            outline-none

                            ${darkMode

                                ? "bg-slate-800 text-white"

                                : "bg-gray-200 text-slate-900"

                            }

                        `}
                    />

                </div>

                {/* ADDRESS */}

                <textarea

                    name="address"

                    placeholder="Address"

                    value={patientData.address}

                    onChange={handleChange}

                    rows="5"

                    required

                    className={`

                        w-full
                        p-5
                        rounded-xl
                        outline-none

                        ${darkMode

                            ? "bg-slate-800 text-white"

                            : "bg-gray-200 text-slate-900"

                        }

                    `}
                />


                {/* SUBMIT */}

                <button

                    type="submit"

                    className="w-full p-5 font-bold text-white transition rounded-xl bg-cyan-500 hover:bg-cyan-600"

                >

                    Register Patient

                </button>

            </form>

        </div>
    )
}

export default PatientForm