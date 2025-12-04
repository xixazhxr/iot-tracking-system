import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, AlertCircle, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/projects", label: "Projects", icon: FolderKanban },
        { path: "/tasks", label: "Tasks", icon: CheckSquare },
        { path: "/issues", label: "Issues", icon: AlertCircle },
        { path: "/team", label: "Team", icon: Users },
    ];

    return (
        <div className="w-64 bg-primary text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
            <div className="p-6 border-b border-primary-dark">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                        IoT
                    </div>
                    <h1 className="text-xl font-bold tracking-wide">Tracker</h1>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-white text-primary font-semibold shadow-md"
                                    : "text-white/80 hover:bg-primary-light hover:text-white"
                                }`}
                        >
                            <Icon size={20} className={isActive ? "text-primary" : "text-white/80 group-hover:text-white"} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-primary-dark">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/80 hover:bg-primary-light hover:text-white transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
