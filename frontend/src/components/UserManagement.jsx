import { useEffect, useState } from "react"
import axios from "axios"

function UserManagement({ darkMode }) {

    // =========================================
    // STATES
    // =========================================

    const [users, setUsers] = useState([])

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("DOCTOR")

    // =========================================
    // FETCH USERS
    // =========================================

    useEffect(() => {

        fetchUsers()

    }, [])

    const fetchUsers = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/auth/users"
            )

            setUsers(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    // =========================================
    // CREATE USER
    // =========================================

    const createUser = async (e) => {

        e.preventDefault()

        try {

            await axios.post(
                "http://127.0.0.1:8000/auth/register",
                {
                    full_name: fullName,
                    email: email,
                    password: password,
                    role: role
                }
            )

            alert("User Created Successfully")

            setFullName("")
            setEmail("")
            setPassword("")
            setRole("DOCTOR")

            fetchUsers()

        } catch (error) {

            console.log(error)

            alert("Failed to create user")
        }
    }

    // =========================================
    // DELETE USER
    // =========================================

    const deleteUser = async (id) => {

        try {

            await axios.delete(
                `http://127.0.0.1:8000/auth/users/${id}`
            )

            fetchUsers()

        } catch (error) {

            console.log(error)
        }
    }

    return (

        <div
            className={`

                p-8
                rounded-3xl
                shadow-2xl

                ${
                    darkMode
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900"
                }

            `}
        >

            <h2 className="text-4xl font-bold text-cyan-400 mb-10">

                User Management

            </h2>

            {/* CREATE USER FORM */}

            <form
                onSubmit={createUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="
                        p-4
                        rounded-xl
                        bg-slate-800
                        text-white
                        outline-none
                    "
                    required
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                        p-4
                        rounded-xl
                        bg-slate-800
                        text-white
                        outline-none
                    "
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                        p-4
                        rounded-xl
                        bg-slate-800
                        text-white
                        outline-none
                    "
                    required
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="
                        p-4
                        rounded-xl
                        bg-slate-800
                        text-white
                        outline-none
                    "
                >

                    <option value="DOCTOR">
                        Doctor
                    </option>

                    <option value="STAFF">
                        Staff
                    </option>

                </select>

                <button
                    type="submit"
                    className="
                        md:col-span-2
                        bg-cyan-500
                        hover:bg-cyan-600
                        transition
                        p-4
                        rounded-xl
                        text-xl
                        font-bold
                    "
                >

                    Create User

                </button>

            </form>

            {/* USER TABLE */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr
                            className={
                                darkMode
                                ? "bg-slate-800"
                                : "bg-gray-200"
                            }
                        >

                            <th className="p-4 text-left">
                                ID
                            </th>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Role
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b border-slate-700"
                            >

                                <td className="p-4">
                                    {user.id}
                                </td>

                                <td className="p-4">
                                    {user.full_name}
                                </td>

                                <td className="p-4">
                                    {user.email}
                                </td>

                                <td className="p-4">

                                    <span
                                        className={`

                                            px-4
                                            py-1
                                            rounded-full
                                            text-sm
                                            font-bold

                                            ${
                                                user.role === "ADMIN"
                                                ? "bg-red-500"

                                                : user.role === "DOCTOR"
                                                ? "bg-cyan-500"

                                                : "bg-green-500"
                                            }

                                        `}
                                    >

                                        {user.role}

                                    </span>

                                </td>

                                <td className="p-4">

                                    <button

                                        onClick={() => deleteUser(user.id)}

                                        className="
                                            bg-red-500
                                            hover:bg-red-600
                                            px-4
                                            py-2
                                            rounded-xl
                                            font-semibold
                                        "
                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default UserManagement