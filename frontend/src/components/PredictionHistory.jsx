import { useEffect, useState } from "react";
import api from "../services/api";

function PredictionHistory({ darkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Fetch Prediction History
  // ==========================
  const fetchHistory = async () => {
    try {
      const response = await api.get("/prediction-history/");

      console.log("Prediction History Response:", response.data);

      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching prediction history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ==========================
  // Risk Badge Colors
  // ==========================
  const getRiskColor = (risk) => {
    if (risk === "No Risk") {
      return "bg-green-500 text-white";
    }

    if (risk === "Moderate Risk") {
      return "bg-yellow-500 text-black";
    }

    return "bg-red-500 text-white";
  };

  return (
    <div
      className={`
        mt-16 rounded-2xl shadow-2xl overflow-hidden border
        ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-300"
        }
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-cyan-500">
        <h2 className="text-3xl font-bold text-cyan-400">
          Prediction History
        </h2>

        <p
          className={`mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Clinical prediction records stored in PostgreSQL.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={darkMode ? "bg-slate-800" : "bg-gray-100"}
          >
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Patient ID</th>
              <th className="p-4 text-left">Risk Level</th>
              <th className="p-4 text-left">Confidence</th>
              <th className="p-4 text-left">No Risk %</th>
              <th className="p-4 text-left">Moderate %</th>
              <th className="p-4 text-left">High Risk %</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-6 font-medium text-center text-cyan-500"
                >
                  Loading prediction history...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-6 text-center text-gray-500"
                >
                  No prediction history found.
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t ${
                    darkMode
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-gray-200 hover:bg-gray-50"
                  } transition`}
                >
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-medium">{item.patient_id}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(
                        item.risk_level
                      )}`}
                    >
                      {item.risk_level}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-cyan-500">
                    {Number(item.confidence_score).toFixed(2)}%
                  </td>

                  <td className="p-4 font-medium text-green-600">
                    {Number(item.no_risk_probability).toFixed(2)}%
                  </td>

                  <td className="p-4 font-medium text-yellow-600">
                    {Number(item.moderate_risk_probability).toFixed(2)}%
                  </td>

                  <td className="p-4 font-medium text-red-600">
                    {Number(item.high_risk_probability).toFixed(2)}%
                  </td>

                  <td className="p-4 text-sm">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PredictionHistory;