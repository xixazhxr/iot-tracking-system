import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import Issues from "./pages/Issues";
import Team from "./pages/Team";
import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/issues" element={<Issues />} />
                    <Route path="/team" element={<Team />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
