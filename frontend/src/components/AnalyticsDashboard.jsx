import { useEffect, useState } from "react"
import axios from "axios"

function AnalyticsDashboard({ darkMode }) {

    // =========================================
    // STATE
    // =========================================

    const [predictions, setPredictions] = useState([])

    // =========================================
    // FETCH PREDICTIONS
    // =========================================

    useEffect(() => {

        fetchPredictions()

    }, [])

    const fetchPredictions = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/prediction-history/"
            )

            setPredictions(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    // =========================================
    // ANALYTICS CALCULATIONS
    // =========================================

    const totalPredictions = predictions.length

    const highRisk = predictions.filter(
        (prediction) =>
            prediction.risk_level === "High Risk"
    ).length

    const moderateRisk = predictions.filter(
        (prediction) =>
            prediction.risk_level === "Moderate Risk"
    ).length

    const noRisk = predictions.filter(
        (prediction) =>
            prediction.risk_level === "No Risk"
    ).length

    // =========================================
    // UI
    // =========================================

    return (

        <div
            className={`

                mt-10
                p-8
                rounded-2xl
                shadow-2xl

                ${
                    darkMode
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-900"
                }

            `}
        >

            <h2 className="text-4xl font-bold text-cyan-400 mb-10">
                Analytics Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* TOTAL */}

                <div className="bg-cyan-500 p-6 rounded-2xl text-white">

                    <h3 className="text-xl font-bold">
                        Total Predictions
                    </h3>

                    <p className="text-4xl mt-4 font-extrabold">
                        {totalPredictions}
                    </p>

                </div>

                {/* HIGH RISK */}

                <div className="bg-red-500 p-6 rounded-2xl text-white">

                    <h3 className="text-xl font-bold">
                        High Risk
                    </h3>

                    <p className="text-4xl mt-4 font-extrabold">
                        {highRisk}
                    </p>

                </div>

                {/* MODERATE RISK */}

                <div className="bg-yellow-500 p-6 rounded-2xl text-white">

                    <h3 className="text-xl font-bold">
                        Moderate Risk
                    </h3>

                    <p className="text-4xl mt-4 font-extrabold">
                        {moderateRisk}
                    </p>

                </div>

                {/* NO RISK */}

                <div className="bg-green-500 p-6 rounded-2xl text-white">

                    <h3 className="text-xl font-bold">
                        No Risk
                    </h3>

                    <p className="text-4xl mt-4 font-extrabold">
                        {noRisk}
                    </p>

                </div>

            </div>

        </div>
    )
}

export default AnalyticsDashboard