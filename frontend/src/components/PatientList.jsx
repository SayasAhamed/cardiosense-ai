import { useEffect, useState } from "react"
import axios from "axios"

import PatientProfile from "./PatientProfile.jsx"

function PatientList({

    darkMode,

    refreshPatients

}) {

    const [patients, setPatients] = useState([])

    const [selectedPatient, setSelectedPatient] = useState(null)

    // ====================================
    // FETCH PATIENTS
    // ====================================

    const fetchPatients = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/patients/"
            )

            setPatients(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    // ====================================
    // LOAD DATA
    // ====================================

    useEffect(() => {

        fetchPatients()

    }, [refreshPatients])

    return (

        <div className="space-y-8">

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

                    Registered Patients

                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr
                                className={
                                    darkMode
                                        ? "bg-slate-800"
                                        : "bg-gray-200"
                                }
                            >

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Name
                                </th>

                                <th className="p-4 text-left">
                                    Age
                                </th>

                                <th className="p-4 text-left">
                                    Gender
                                </th>

                                <th className="p-4 text-left">
                                    Phone
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                patients.map((patient) => (

                                    <tr
                                        key={patient.id}

                                        onClick={() => {

                                            setSelectedPatient(
                                                patient.id
                                            )
                                        }}

                                        className={`

                                            cursor-pointer
                                            transition-all
                                            duration-300

                                            ${darkMode
                                                ? `
                                                    border-b
                                                    border-slate-800
                                                    hover:bg-slate-800
                                                  `
                                                : `
                                                    border-b
                                                    border-gray-300
                                                    hover:bg-gray-100
                                                  `
                                            }

                                        `}
                                    >

                                        <td className="p-4">
                                            {patient.id}
                                        </td>

                                        <td className="p-4 font-semibold">
                                            {patient.full_name}
                                        </td>

                                        <td className="p-4">
                                            {patient.age}
                                        </td>

                                        <td className="p-4">
                                            {patient.gender}
                                        </td>

                                        <td className="p-4">
                                            {patient.phone}
                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {
                selectedPatient && (

                    <PatientProfile
                        patientId={selectedPatient}
                    />
                )
            }

        </div>
    )
}

export default PatientList