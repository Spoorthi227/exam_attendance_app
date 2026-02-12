import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ArrowLeft, Save, UserCheck, UserX, Search, Loader2, ClipboardCheck, X, AlertCircle } from 'lucide-react';

const AttendanceSheet = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                // Ensure the URL matches your backend route exactly
                const { data } = await api.get(`/attendance/room/${roomId}/students`);
                // Check if data is an array before mapping
                const studentList = Array.isArray(data) ? data : [];
                setStudents(studentList.map(s => ({ ...s, isPresent: true })));
            } catch (err) {
                console.error("Error fetching students:", err.message);
            } finally {
                setLoading(false);
            }
        };
        if (roomId) fetchStudents();
    }, [roomId]);

    const toggleAttendance = (id) => {
        setStudents(prev => prev.map(s => s._id === id ? { ...s, isPresent: !s.isPresent } : s));
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const finalizeSubmission = async () => {
        try {
            setSubmitting(true);
            const payload = {
                roomId,
                teacherId: user?.id || user?._id,
                attendanceData: students.map(s => ({
                    studentId: s._id,
                    status: s.isPresent ? 'present' : 'absent'
                }))
            };

            await api.post('/attendance/mark', payload);
            alert("Success: Attendance report has been archived.");
            navigate('/teacher/dashboard');
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Submission failed"));
        } finally {
            setSubmitting(false);
        }
    };

    const presentCount = students.filter(s => s.isPresent).length;
    const absentCount = students.length - presentCount;

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#4b7bc3]" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-10 font-sans">
            <header className="bg-[#4b7bc3] text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-40">
                <button onClick={() => navigate('/teacher/dashboard')} className="flex items-center gap-2 text-xs font-bold uppercase"><ArrowLeft size={16} /> Dashboard</button>
                <h1 className="font-black uppercase tracking-tighter text-xl">Room {roomId}</h1>
                <button
                    onClick={() => setShowReview(true)}
                    className="bg-[#d9532f] px-6 py-2 rounded font-bold text-sm uppercase shadow-md flex items-center gap-2"
                >
                    <ClipboardCheck size={18} /> Review & Submit
                </button>
            </header>

            <main className="max-w-5xl mx-auto py-8 px-4">
                {/* SEARCH BAR */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Student Name or Roll No..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#4b7bc3] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* STUDENT LIST TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm font-bold text-[#4b7bc3]">{student.rollNo}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">{student.name}</td>
                                    <td className="px-6 py-4 flex justify-center">
                                        <button
                                            onClick={() => toggleAttendance(student._id)}
                                            className={`w-32 py-2 rounded-full text-[10px] font-black flex items-center justify-center gap-2 transition-all ${student.isPresent ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                                                }`}
                                        >
                                            {student.isPresent ? <UserCheck size={14} /> : <UserX size={14} />}
                                            {student.isPresent ? 'PRESENT' : 'ABSENT'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center text-gray-400 italic">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* REVIEW MODAL */}
            {showReview && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-800 uppercase">Final Review</h2>
                            <button onClick={() => setShowReview(false)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-2xl text-center">
                                    <p className="text-green-600 font-black text-3xl">{presentCount}</p>
                                    <p className="text-[10px] text-green-700 font-bold uppercase">Present</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-2xl text-center">
                                    <p className="text-red-600 font-black text-3xl">{absentCount}</p>
                                    <p className="text-[10px] text-red-700 font-bold uppercase">Absent</p>
                                </div>
                            </div>
                            <button
                                onClick={finalizeSubmission}
                                disabled={submitting}
                                className="w-full bg-[#4b7bc3] text-white py-4 rounded-2xl font-bold uppercase shadow-lg hover:bg-[#3a62a3] transition-all flex justify-center items-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Confirm Final Submission
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceSheet;

// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import { ArrowLeft, Save, UserCheck, UserX, Search, Loader2, AlertCircle } from 'lucide-react';

// const AttendanceSheet = () => {
//     const { roomId } = useParams(); // This will be the roomNumber from the URL
//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const [students, setStudents] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 setLoading(true);
//                 // Hits your existing backend route to get students for a specific room
//                 const { data } = await api.get(`/attendance/room/${roomId}/students`);

//                 // We map the data and default everyone to 'present' (true)
//                 const initializedStudents = data.map(s => ({
//                     ...s,
//                     isPresent: true
//                 }));

//                 setStudents(initializedStudents);
//             } catch (err) {
//                 console.error("Error fetching students:", err.response?.data || err.message);
//                 setError("Failed to load student list for this room.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (roomId) fetchStudents();
//     }, [roomId]);

//     const toggleAttendance = (id) => {
//         setStudents(prev => prev.map(s =>
//             s._id === id ? { ...s, isPresent: !s.isPresent } : s
//         ));
//     };

//     const handleSubmit = async () => {
//         try {
//             setSubmitting(true);
//             const payload = {
//                 roomId, // Room number from URL
//                 teacherId: user?.id || user?._id,
//                 attendanceData: students.map(s => ({
//                     studentId: s._id,
//                     status: s.isPresent ? 'present' : 'absent'
//                 }))
//             };

//             const response = await api.post('/attendance/mark', payload);

//             if (response.data.success) {
//                 alert("Submission Complete: Attendance record has been safely stored.");
//                 navigate('/teacher/dashboard'); // Redirect back to main dashboard
//             }
//         } catch (err) {
//             console.error("Submit Error:", err);
//             alert("Submission Failed: " + (err.response?.data?.message || "Check network connectivity."));
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Filter logic using 'rollNo' to match your Student.js schema
//     const filteredStudents = students.filter(s =>
//         s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (loading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
//                 <Loader2 className="animate-spin mb-2" size={32} />
//                 <p className="font-bold uppercase tracking-widest text-xs">Loading Student Records...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
//             {/* RVCE STYLE BLUE HEADER */}
//             <header className="bg-[#4b7bc3] text-white shadow-lg sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
//                     <button
//                         onClick={() => navigate('/teacher/dashboard')}
//                         className="flex items-center gap-2 text-xs font-bold hover:bg-white/10 px-3 py-2 rounded transition-all uppercase tracking-tight"
//                     >
//                         <ArrowLeft size={16} /> Dashboard
//                     </button>

//                     <div className="text-center">
//                         <h1 className="text-xl font-black uppercase tracking-tighter">Attendance Sheet</h1>
//                         <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Room Number: {roomId}</p>
//                     </div>

//                     <button
//                         onClick={handleSubmit}
//                         disabled={submitting}
//                         className="bg-[#d9532f] hover:bg-[#c44928] disabled:bg-gray-400 px-6 py-2 rounded font-bold shadow-md flex items-center gap-2 transition-all text-sm uppercase"
//                     >
//                         {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
//                         Submit Data
//                     </button>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto py-8 px-6">
//                 {/* SEARCH BAR SECTION */}
//                 <div className="mb-8 relative max-w-2xl mx-auto">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input
//                         type="text"
//                         placeholder="Search by Student Name or Roll No (e.g. 1RV22...)"
//                         className="w-full pl-12 pr-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#4b7bc3] outline-none text-gray-700 font-medium"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 {error ? (
//                     <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
//                         <AlertCircle size={48} />
//                         <p className="font-bold">{error}</p>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left border-collapse">
//                                 <thead>
//                                     <tr className="bg-gray-50 border-b border-gray-100">
//                                         <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</th>
//                                         <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
//                                         <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {filteredStudents.length > 0 ? filteredStudents.map((student) => (
//                                         <tr key={student._id} className="hover:bg-blue-50/50 transition-colors group">
//                                             <td className="px-8 py-4 font-mono text-sm font-bold text-[#4b7bc3]">
//                                                 {student.rollNo}
//                                             </td>
//                                             <td className="px-8 py-4">
//                                                 <p className="text-sm font-bold text-gray-700 uppercase">{student.name}</p>
//                                                 <p className="text-[10px] text-gray-400 font-semibold">{student.department} | Sem {student.semester}</p>
//                                             </td>
//                                             <td className="px-8 py-4">
//                                                 <button
//                                                     onClick={() => toggleAttendance(student._id)}
//                                                     className={`w-32 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center justify-center gap-2 mx-auto transition-all transform active:scale-95 ${student.isPresent
//                                                         ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm'
//                                                         : 'bg-red-50 text-red-600 border border-red-100'
//                                                         }`}
//                                                 >
//                                                     {student.isPresent ? <UserCheck size={14} /> : <UserX size={14} />}
//                                                     {student.isPresent ? 'PRESENT' : 'ABSENT'}
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     )) : (
//                                         <tr>
//                                             <td colSpan="3" className="py-20 text-center text-gray-400 italic text-sm">
//                                                 No students found matching your search.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* FOOTER STATS */}
//                         <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
//                             <span>Total Students: {filteredStudents.length}</span>
//                             <span className="text-green-600">Present: {students.filter(s => s.isPresent).length}</span>
//                             <span className="text-red-500">Absent: {students.filter(s => !s.isPresent).length}</span>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default AttendanceSheet;