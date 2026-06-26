import { useEffect, useState } from "react"
import axios from "axios"

function PredictionHistory({ darkMode }) {

    const [history, setHistory] = useState([])

    // FETCH HISTORY
    useEffect(() => {

        fetchHistory()

    }, [])

    const fetchHistory = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/prediction-history/"
            )

            setHistory(response.data)

        } catch (error) {

            console.log(error)

        }
    }

    // RISK COLORS
    const getRiskColor = (risk) => {

        if (risk === "No Risk") {
            return "bg-green-500"
        }

        if (risk === "Moderate Risk") {
            return "bg-yellow-500"
        }

        return "bg-red-500"
    }

    return (

        <div
            className={`
                mt-16
                rounded-2xl
                shadow-2xl
                overflow-hidden
                border
                ${darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-300"}
            `}
        >

            {/* HEADER */}
            <div className="p-6 border-b border-cyan-500">

                <h2 className="text-3xl font-bold text-cyan-400">
                    Prediction History
                </h2>

                <p
                    className={`mt-2 ${
                        darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                    }`}
                >
                    Clinical prediction records stored in PostgreSQL
                </p>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead
                        className={
                            darkMode
                                ? "bg-slate-800"
                                : "bg-gray-100"
                        }
                    >

                        <tr>
                            <th className="p-4 text-left">
                                No
                            </th>

                            <th className="p-4 text-left">
                                Patient ID
                            </th>

                            <th className="p-4 text-left">
                                Risk Level
                            </th>

                            <th className="p-4 text-left">
                                Confidence
                            </th>

                            <th className="p-4 text-left">
                                No Risk %
                            </th>

                            <th className="p-4 text-left">
                                Moderate %
                            </th>

                            <th className="p-4 text-left">
                                High Risk %
                            </th>

                            <th className="p-4 text-left">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            history.map((item, index) => (

                                <tr
                                    key={item.id}
                                    className={`
                                        border-t
                                        ${
                                            darkMode
                                                ? "border-slate-800 hover:bg-slate-800"
                                                : "border-gray-200 hover:bg-gray-100"
                                        }
                                        transition
                                    `}
                                >

                                    <td className="p-4 font-semibold text-cyan-400">
                                        {index + 1}
                                    </td>

                                    <td className="p-4">
                                        #{item.patient_id}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`
                                                px-4
                                                py-1
                                                rounded-full
                                                text-white
                                                text-sm
                                                font-semibold
                                                ${getRiskColor(item.risk_level)}
                                            `}
                                        >
                                            {item.risk_level}
                                        </span>

                                    </td>

                                    <td className="p-4 font-semibold text-cyan-400">
                                        {item.confidence_score}%
                                    </td>

                                    <td className="p-4">
                                        {item.no_risk_probability}%
                                    </td>

                                    <td className="p-4">
                                        {item.moderate_risk_probability}%
                                    </td>

                                    <td className="p-4">
                                        {item.high_risk_probability}%
                                    </td>

                                    <td className="p-4">
                                        {
                                            new Date(
                                                item.created_at
                                            ).toLocaleString()
                                        }
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>

    )
}

export default PredictionHistory