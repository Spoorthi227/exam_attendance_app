import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ArrowLeft, Clock, CheckCircle2, Loader2, AlertCircle, Download, FileText } from 'lucide-react';

const AttendanceHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            // Prioritize retrieving the correct teacher ID from the context
            const teacherId = user?.id || user?._id;

            if (!teacherId) return;

            try {
                setLoading(true);
                // GET request to retrieve history for the specific teacher
                const { data } = await api.get(`/attendance/history/${teacherId}`);
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("History fetch failed:", err);
                setError("Could not load your submission history.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    // Function to generate and download a text report for a specific record
    const downloadReport = (record) => {
        const fileName = `Attendance_Room${record.roomId}_${new Date(record.createdAt).toLocaleDateString()}.txt`;

        // Use optional chaining (?.) to safely access populated names
        const teacherName = record.teacherId?.name || "Teacher Name Not Found";

        let content = `RVCE EXAM ATTENDANCE PORTAL - OFFICIAL REPORT\n`;
        content += `==============================================\n`;
        content += `Room Number  : ${record.roomId}\n`;
        content += `Teacher Name : ${teacherName}\n`; // Displaying Name instead of ID
        content += `Date         : ${new Date(record.createdAt).toLocaleDateString()}\n`;
        content += `Time         : ${new Date(record.createdAt).toLocaleTimeString()}\n`;
        content += `Total Logged : ${record.students.length} Students\n`;
        content += `==============================================\n\n`;
        content += `STUDENT ATTENDANCE LIST:\n`;
        content += `----------------------------------------------\n`;
        content += `STATUS    | ROLL NO     | STUDENT NAME\n`;
        content += `----------------------------------------------\n`;

        record.students.forEach(s => {
            const status = s.status.toUpperCase().padEnd(9);
            // Access the populated student details properly
            const roll = (s.studentId?.rollNo || "N/A").padEnd(11);
            const name = s.studentId?.name || "Unknown Student";
            content += `${status} | ${roll} | ${name}\n`;
        });

        content += `\n----------------------------------------------\n`;
        content += `End of Report\n`;

        // Trigger Download
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-[#4b7bc3] mb-2" size={40} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Records...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b-2 p-6 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Submission History</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-10 px-6">
                {error ? (
                    <div className="text-center py-20 text-red-500 bg-white rounded-3xl border border-red-100">
                        <AlertCircle className="mx-auto mb-2" size={40} />
                        <p className="font-bold">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.length > 0 ? history.map((record) => (
                            <div key={record._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-[#4b7bc3] transition-all gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-blue-50 p-3 rounded-full text-[#4b7bc3]"><Clock size={20} /></div>
                                    <div>
                                        <p className="font-black text-gray-800 uppercase tracking-tight text-lg leading-none">Room {record.roomId}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                                            {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Status: Archived</p>
                                        <p className="text-sm text-gray-700 font-bold">{record.students?.length || 0} Students Logged</p>
                                    </div>

                                    <button
                                        onClick={() => downloadReport(record)}
                                        className="bg-[#4b7bc3] text-white p-3 rounded-xl hover:bg-[#3a62a3] transition-all shadow-md group"
                                        title="Download Text Report"
                                    >
                                        <Download size={20} className="group-active:scale-90 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <Clock size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-medium italic">No attendance reports found for your profile.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AttendanceHistory;