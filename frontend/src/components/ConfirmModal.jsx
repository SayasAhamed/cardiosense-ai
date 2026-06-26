function ConfirmModal({

    isOpen,

    title,

    message,

    confirmText,

    cancelText,

    onConfirm,

    onCancel,

    darkMode,

    type = "primary"

}) {

    if (!isOpen) return null

    const buttonColors = {

        danger: "bg-red-600 hover:bg-red-700",

        warning: "bg-yellow-500 hover:bg-yellow-600",

        success: "bg-green-600 hover:bg-green-700",

        primary: "bg-cyan-500 hover:bg-cyan-600"
    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div

                className={`

                    w-[90%]
                    max-w-md
                    p-8
                    rounded-2xl
                    shadow-2xl
                    border
                    animate-fadeIn

                    ${darkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-slate-900"
                    }

                `}
            >

                <h2 className="mb-4 text-2xl font-bold">

                    {title}

                </h2>

                <p className="mb-8 text-gray-400">

                    {message}

                </p>

                <div className="flex justify-end gap-4">

                    <button

                        onClick={onCancel}

                        className={`

                            px-5
                            py-2
                            rounded-xl
                            transition

                            ${darkMode
                                ? "bg-slate-700 hover:bg-slate-600"
                                : "bg-gray-300 hover:bg-gray-400"
                            }

                        `}
                    >

                        {cancelText || "Cancel"}

                    </button>

                    <button

                        onClick={onConfirm}

                        className={`

                            px-5
                            py-2
                            rounded-xl
                            text-white
                            transition

                            ${buttonColors[type]}

                        `}
                    >

                        {confirmText || "Confirm"}

                    </button>

                </div>

            </div>

        </div>
    )
}

export default ConfirmModal