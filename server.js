const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examTestRoutes = require('./routes/examTestRoutes');
const examQuestionRoutes = require('./routes/examQuestionRoutes');

dotenv.config();

const app = express();  // Move this line up to define 'app' before using it

const allowedOrigins = [
    "http://localhost:3039",
    "http://13.40.120.157:6340",
    "http://sheru.solidblackabroad.com"
];

// CORS middleware should come after defining 'app'
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS policy does not allow access from this origin"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-access-key"],
        credentials: true,
    })
);

// Handle preflight requests
app.options("*", cors());

// Middleware to check the x-access-key header
const checkHeaderString = (req, res, next) => {
    const requiredString = "your-secret-string"; // Replace with your required string

    // Check if the required string is in the header
    const headerValue = req.headers["x-access-key"];

    if (headerValue && headerValue === requiredString) {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: Invalid or missing header string" });
};

// Apply the custom header check middleware
app.use(checkHeaderString);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', chapterRoutes);
app.use('/api', questionRoutes);
app.use('/api', examTestRoutes);
app.use('/api', examQuestionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
