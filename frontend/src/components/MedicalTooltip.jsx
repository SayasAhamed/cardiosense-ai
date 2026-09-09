import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";

function MedicalTooltip({ title, normalRange, description, darkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="ml-2 text-cyan-500 hover:text-cyan-600"
      >
        <FaInfoCircle size={15} />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-72 p-4 rounded-xl shadow-2xl border mt-2 left-0 ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-slate-800"
          }`}
        >
          <h4 className="mb-2 font-bold text-cyan-400">{title}</h4>

          <p className="mb-2 text-sm">{description}</p>

          <div className="text-xs font-semibold text-green-500">
            Normal Range: {normalRange}
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalTooltip;