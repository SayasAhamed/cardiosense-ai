import { useEffect, useState } from "react"
import axios from "axios"

function PatientProfile({ patientId }) {

    const [patient, setPatient] = useState(null)

    const fetchPatient = async () => {

        try {

            const response = await axios.get(
                `http://127.0.0.1:8000/patients/${patientId}`
            )

            setPatient(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {

        if (patientId) {

            fetchPatient()
        }

    }, [patientId])

    if (!patient) {

        return null
    }

    return (

        <div className="p-8 border shadow-2xl rounded-2xl bg-slate-900 border-slate-800">

            <h2 className="mb-6 text-3xl font-bold text-cyan-400">

                Patient Profile

            </h2>

            <div className="grid grid-cols-2 gap-6">

                <div>

                    <p className="text-gray-400">
                        Full Name
                    </p>

                    <h3 className="text-xl font-bold">
                        {patient.full_name}
                    </h3>

                </div>

                <div>

                    <p className="text-gray-400">
                        Age
                    </p>

                    <h3 className="text-xl font-bold">
                        {patient.age}
                    </h3>

                </div>

                <div>

                    <p className="text-gray-400">
                        Gender
                    </p>

                    <h3 className="text-xl font-bold">
                        {patient.gender}
                    </h3>

                </div>

                <div>

                    <p className="text-gray-400">
                        Phone
                    </p>

                    <h3 className="text-xl font-bold">
                        {patient.phone}
                    </h3>

                </div>

                <div className="col-span-2">

                    <p className="text-gray-400">
                        Address
                    </p>

                    <h3 className="text-xl font-bold">
                        {patient.address}
                    </h3>

                </div>

            </div>

        </div>
    )
}

export default PatientProfile