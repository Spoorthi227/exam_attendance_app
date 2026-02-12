const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure this points to your User model file

const createTeacher = async () => {
    try {
        // Paste your string directly here
        const MONGO_URI = "mongodb://localhost:27017/exam_attendance";

        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        const teacherData = {
            name: "Test Teacher",
            email: "teacher@test.com",
            password: "Password123!",
            role: "teacher",
            department: "Computer Science"
        };

        const newTeacher = await User.create(teacherData);
        console.log("Teacher created successfully:", newTeacher.email);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

createTeacher();