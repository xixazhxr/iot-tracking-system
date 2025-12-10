import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage or validate token on load
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            toast.success("Login successful");
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            const msg = error.response?.data?.error || "Login failed";
            toast.error(msg);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.success("Logged out");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
