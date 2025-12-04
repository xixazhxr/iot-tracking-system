import { useState, useEffect } from "react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import { Search, Filter, Mail, Phone, MapPin, Briefcase, User } from "lucide-react";

export default function Team() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users/");
                setMembers(res.data.users);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                        <p className="text-gray-500 mt-1">Overview of team members and availability</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                            />
                        </div>
                        <button className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Filter size={18} /> Filter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Briefcase size={12} /> {member.role}
                                        </p>
                                    </div>
                                </div>
                                <span className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${member.status === "Online" ? "bg-green-500" :
                                    member.status === "Offline" ? "bg-gray-400" :
                                        "bg-yellow-500"
                                    }`} title={member.status}></span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>+1 (555) 000-0000</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">Current Workload</span>
                                    <span className="font-bold text-gray-900">{member.workload}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${member.workload > 80 ? "bg-red-500" :
                                            member.workload > 50 ? "bg-blue-500" :
                                                "bg-green-500"
                                            }`}
                                        style={{ width: `${member.workload}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 py-2.5 text-sm font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20">
                                    View Profile
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-primary bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                                    <Mail size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="col-span-3 p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <User size={48} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">No team members found</p>
                                <p className="text-sm">Add members to your projects to see them here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
