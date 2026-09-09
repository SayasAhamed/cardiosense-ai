function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  darkMode,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`w-[90%] max-w-md rounded-2xl shadow-2xl p-6 ${
          darkMode ? "bg-slate-900 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="mb-3 text-2xl font-bold text-red-500">{title}</h2>

        <p className="mb-6 text-gray-500">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 font-semibold text-white bg-gray-500 rounded-xl hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600"
          >
            Delete Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;