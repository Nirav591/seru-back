const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examTestRoutes = require('./routes/examTestRoutes');
const examQuestionRoutes = require('./routes/examQuestionRoutes');
const https = require('https');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Load SSL Certificates
const privateKey = fs.readFileSync(path.resolve(__dirname, 'ssl/private.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'ssl/server.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const allowedOrigins = [
    "http://localhost:3039",
    "https://13.40.120.157:6340",
    "https://sheru.solidblackabroad.com",
    "https://admin.solidblackabroad.com"
];

// CORS middleware
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

    const headerValue = req.headers["x-access-key"];

    if (headerValue && headerValue === requiredString) {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: Invalid or missing header string" });
};

app.use(checkHeaderString);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', chapterRoutes);
app.use('/api', questionRoutes);
app.use('/api', examTestRoutes);
app.use('/api', examQuestionRoutes);

// Create HTTPS Server
const server = https.createServer(credentials, app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});