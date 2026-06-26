function MedicalTooltip({

    title,

    description

}) {

    return (

        <div className="relative inline-block ml-2 group">

            {/* INFO ICON */}

            <span
                className="text-sm font-bold transition cursor-pointer text-cyan-400 hover:text-cyan-300"
            >

                ⓘ

            </span>

            {/* TOOLTIP */}

            <div
                className="absolute left-0 z-50 hidden p-5 border shadow-2xl group-hover:block w-80 bg-slate-900 border-cyan-500 rounded-2xl top-8 animate-fadeIn"
            >

                <h3
                    className="mb-3 text-lg font-bold text-cyan-400"
                >

                    {title}

                </h3>

                <p
                    className="text-sm leading-relaxed text-gray-300 "
                >

                    {description}

                </p>

            </div>

        </div>
    )
}

export default MedicalTooltip