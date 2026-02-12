const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure this path is correct

const reset = async () => {
    try {
        // Hardcoding the URI to bypass the "undefined" error
        const URI = "mongodb://localhost:27017/exam_attendance";

        await mongoose.connect(URI);
        console.log("Connected to MongoDB...");

        // Remove the existing user to avoid "Email already exists" errors
        await User.deleteOne({ email: "teacher@test.com" });

        // Create the fresh user
        // IMPORTANT: Use the password "Password123!" for your login test
        await User.create({
            name: "Test Teacher",
            email: "teacher@test.com",
            password: "pass123",
            role: "teacher",
            department: "Computer Science"
        });

        console.log("User 'teacher@test.com' created with password 'pass123'");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await mongoose.connection.close();
    }
};

reset();