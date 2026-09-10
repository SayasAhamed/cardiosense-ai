import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import { getDashboardStats } from "../services/dashboardApi";

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_predictions: 0,
    no_risk: 0,
    moderate_risk: 0,
    high_risk: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-500">
          Clinical Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          CardioSense AI Clinical Overview
        </p>
      </div>

      <DashboardCards
        stats={stats}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Dashboard;