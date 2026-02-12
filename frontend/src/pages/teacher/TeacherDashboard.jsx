import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { LogOut, MapPin, Bell, BookOpen, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            const teacherId = user?.id || user?._id;
            if (!teacherId) return;

            try {
                setLoading(true);
                const { data } = await api.get(`/attendance/teacher/${teacherId}/rooms`);
                setRooms(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err.response?.data);
                // We keep the error state but allow for manual testing
                setError(err.response?.data?.message || "Server Communication Error");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [user]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-[#4b7bc3] mb-2" size={40} />
                <p className="text-gray-500 font-medium tracking-tight">Syncing with Server...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <header className="border-b-2 border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                        <span className="font-bold text-[10px] text-center leading-tight text-gray-400">RVCE<br />PORTAL</span>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-700 tracking-tight uppercase font-black">Exam Attendance</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Faculty Management System</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{user?.department || 'Department'}</p>
                    </div>
                    <button onClick={logout} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="bg-[#4b7bc3] text-white py-2 px-6 md:px-12 flex items-center gap-4 shadow-md">
                <div className="bg-white/20 px-3 py-1 rounded flex items-center gap-2 flex-shrink-0 border border-white/30">
                    <Bell size={14} />
                    <span className="font-bold uppercase text-[10px] tracking-widest">Status</span>
                </div>
                <marquee className="text-xs font-medium">Please ensure all USNs are verified before final submission. Attendance portal closes 15 mins after commencement.</marquee>
            </div>

            <main className="max-w-7xl mx-auto py-10 px-6">
                <div className="relative mb-16 text-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[#d9532f] px-10 py-2 text-white font-bold uppercase tracking-widest text-sm shadow-md transform -skew-x-12">
                            Active Room Allocations
                        </span>
                    </div>
                </div>

                {error ? (
                    <div className="max-w-xl mx-auto p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                        <AlertCircle className="mx-auto text-[#d9532f] mb-4" size={48} />
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Technical Sync Issue</h2>
                        <p className="text-gray-500 text-sm mb-8">The system encountered an error loading your assigned rooms. This is usually due to a schema mismatch.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/teacher/attendance/101')}
                                className="w-full bg-[#4b7bc3] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#3a62a3] transition-all"
                            >
                                MANUAL ENTRY (ROOM 101)
                            </button>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Developer Log: {error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.length > 0 ? rooms.map((room) => (
                            <div key={room._id} className="group bg-white border-t-4 border-[#4b7bc3] shadow-lg rounded-b-xl p-6 hover:shadow-2xl transition-all border-l border-r border-b border-gray-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-blue-50 p-3 rounded-lg text-[#4b7bc3]">
                                        <MapPin size={28} />
                                    </div>
                                    <span className="text-3xl font-black text-gray-100 group-hover:text-blue-50/50 transition-colors uppercase">
                                        #{room.roomNumber}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Room {room.roomNumber}</h3>

                                <div className="space-y-4 mb-10">
                                    {room.examGroups?.map((group, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border-l-4 border-[#d9532f]">
                                            <BookOpen size={18} className="text-[#d9532f] mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-black text-gray-700 text-sm leading-tight uppercase tracking-tighter">
                                                    {typeof group.examId === 'object' ? group.examId?.examName : "External Exam Block"}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase mt-1 font-bold">{group.department}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(`/teacher/attendance/${room.roomNumber}`)}
                                    className="w-full bg-[#4b7bc3] hover:bg-[#3a62a3] text-white font-bold py-4 rounded-xl text-xs tracking-widest transition-all shadow-md active:scale-95 uppercase"
                                >
                                    Open Attendance Sheet
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                                <UserIcon size={40} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-400 text-sm italic font-medium">No active room allocations assigned to this session.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeacherDashboard;