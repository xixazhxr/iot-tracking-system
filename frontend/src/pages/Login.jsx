import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        setSuccess("");
        try {
            if (isRegister) {
                await api.post("/auth/register", { name, email, password: pass });
                setSuccess("Registration successful! Please login.");
                setIsRegister(false);
                setPass(""); // Clear password for security
            } else {
                const res = await api.post("/auth/login", { email, password: pass });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {isRegister ? "IoT Tracking Sign Up" : "IoT Tracking Login"}
                </h2>
                {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 mb-4 text-sm text-center">{success}</p>}

                {isRegister && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            className="input w-full p-2 border rounded"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        className="input w-full p-2 border rounded"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        className="input w-full p-2 border rounded"
                        type="password"
                        placeholder="********"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>

                <button onClick={submit} className="btn w-full font-bold bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    {isRegister ? "Sign Up" : "Login"}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        {isRegister ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError("");
                                setSuccess("");
                            }}
                            className="text-blue-500 font-bold hover:underline"
                        >
                            {isRegister ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
