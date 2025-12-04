import { Link } from "react-router-dom";

export default function Navbar() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
            <h1 className="font-bold text-xl">IoT Tracker</h1>
            <div className="space-x-4">
                <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                <Link to="/projects" className="hover:text-gray-200">Projects</Link>
                <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            </div>
        </nav>
    );
}
