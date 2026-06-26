import MedicalTooltip from "./MedicalTooltip"

function InputField({

    label,

    tooltipTitle,

    tooltipDescription,

    helperText,

    type = "text",

    name,

    value,

    onChange,

    placeholder,

    darkMode

}) {

    return (

        <div className="space-y-2">

            {/* LABEL */}

            <label
                className="flex items-center text-lg font-semibold "
            >

                {label}

                <MedicalTooltip

                    title={tooltipTitle}

                    description={tooltipDescription}

                />

            </label>

            {/* INPUT */}

            <input

                type={type}

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                className={`

                    w-full
                    p-4
                    rounded-xl
                    outline-none
                    border

                    transition-all
                    duration-300

                    focus:ring-2
                    focus:ring-cyan-500

                    ${darkMode

                        ? `
                            bg-slate-800
                            border-slate-700
                            text-white
                          `

                        : `
                            bg-gray-100
                            border-gray-300
                            text-slate-900
                          `
                    }

                `}
            />

            {/* HELPER TEXT */}

            <p
                className="text-sm text-gray-400 "
            >

                {helperText}

            </p>

        </div>
    )
}

export default InputField