import {
  FaUsers,
  FaBrain,
  FaHeart,
  FaHeartbeat,
} from "react-icons/fa";

const DashboardCards = ({ stats, darkMode }) => {
  const cards = [
    {
      title: "Total Patients",
      value: stats.total_patients,
      icon: <FaUsers size={30} />,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "AI Predictions",
      value: stats.total_predictions,
      icon: <FaBrain size={30} />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "No Risk Cases",
      value: stats.no_risk,
      icon: <FaHeart size={30} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "High Risk Cases",
      value: stats.high_risk,
      icon: <FaHeartbeat size={30} />,
      color: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-3xl p-6 shadow-lg text-white bg-gradient-to-r ${card.color}`}
        >
          <div className="flex items-center justify-between">
            {card.icon}

            <h2 className="text-3xl font-bold">{card.value}</h2>
          </div>

          <p className="mt-5 text-sm tracking-wider uppercase">
            {card.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;