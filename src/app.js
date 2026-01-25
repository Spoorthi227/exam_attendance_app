const express = require("express");
const cors = require("cors");

const healthRoute = require("./routes/health.route");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);   // router
app.use(errorHandler);             // function
app.use("/auth", require("./routes/auth.route"));
app.use("/students", require("./routes/student.route"));
app.use("/rooms", require("./routes/room.route"));

app.use(errorHandler);
module.exports = app;
