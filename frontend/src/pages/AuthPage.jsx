import { useState } from "react"
import axios from "axios"

function AuthPage({ setIsAuthenticated, setUserRole }) {

    const [selectedRole, setSelectedRole] = useState("ADMIN")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = async (e) => {

        e.preventDefault()

        setLoading(true)
        setError("")

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/auth/login",
                {
                    email,
                    password
                }
            )

            const data = response.data

            // SAVE TOKEN

            localStorage.setItem(
                "token",
                data.access_token
            )

            localStorage.setItem(
                "role",
                data.role
            )

            // SET AUTH

                if (
                    !data.role ||
                    data.role.toLowerCase() !==
                    selectedRole.toLowerCase()
                ) {

                    setError(
                        `Access denied for ${selectedRole} portal`
                    )

                    return
                }

            setIsAuthenticated(true)

            setUserRole(data.role)

        } catch (err) {

            console.log(err)

            setError("Invalid Email or Password")

        } finally {

            setLoading(false)
        }
    }

    // =========================================
    // ROLE CARD
    // =========================================

    const RoleCard = ({ role, title, desc, color }) => (

        <div

            onClick={() => setSelectedRole(role)}

            className={`

                cursor-pointer
                p-6
                rounded-3xl
                transition-all
                duration-300
                border-2
                hover:scale-105
                shadow-xl

                ${
                    selectedRole === role
                    ? `${color} border-white`
                    : "bg-slate-800 border-transparent"
                }

            `}
        >

            <h2 className="text-2xl font-bold mb-3">
                {title}
            </h2>

            <p className="text-gray-200">
                {desc}
            </p>

        </div>
    )

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

            <div className="max-w-6xl w-full">

                {/* TITLE */}

                <div className="text-center mb-14">

                    <h1 className="text-6xl font-extrabold text-cyan-400 mb-4">
                        CardioSense AI
                    </h1>

                    <p className="text-gray-400 text-xl">
                        Clinical Heart Disease Severity Prediction Platform
                    </p>

                </div>

                {/* ROLE PORTALS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">

                    <RoleCard
                        role="ADMIN"
                        title="Admin Portal"
                        desc="Manage system users, analytics and hospital operations."
                        color="bg-red-600"
                    />

                    <RoleCard
                        role="DOCTOR"
                        title="Doctor Portal"
                        desc="Create predictions, clinical reports and AI explanations."
                        color="bg-cyan-600"
                    />

                    <RoleCard
                        role="STAFF"
                        title="Staff Portal"
                        desc="Register patients and manage limited patient information."
                        color="bg-green-600"
                    />

                </div>

                {/* LOGIN FORM */}

                <div className="max-w-xl mx-auto bg-slate-900 p-10 rounded-3xl shadow-2xl border border-cyan-500">

                    <h2 className="text-4xl font-bold text-center text-white mb-8">

                        {selectedRole} Login

                    </h2>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-6"
                    >

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                w-full
                                p-4
                                rounded-xl
                                bg-slate-800
                                text-white
                                outline-none
                                border
                                border-slate-700
                                focus:border-cyan-500
                            "
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full
                                p-4
                                rounded-xl
                                bg-slate-800
                                text-white
                                outline-none
                                border
                                border-slate-700
                                focus:border-cyan-500
                            "
                            required
                        />

                        {error && (

                            <div className="bg-red-500 p-4 rounded-xl text-white text-center">

                                {error}

                            </div>

                        )}

                        <button

                            type="submit"

                            disabled={loading}

                            className="
                                w-full
                                bg-cyan-500
                                hover:bg-cyan-600
                                transition
                                p-4
                                rounded-xl
                                text-xl
                                font-bold
                                text-white
                            "
                        >

                            {loading
                                ? "Authenticating..."
                                : "Login"
                            }

                        </button>

                    </form>

                    {/* FORGOT PASSWORD */}

                    <div className="text-center mt-6">

                        <button className="text-cyan-400 hover:underline">

                            Forgot Password?

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AuthPage