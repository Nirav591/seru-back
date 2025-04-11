const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examTestRoutes = require('./routes/examTestRoutes');
const examQuestionRoutes = require('./routes/examQuestionRoutes');

dotenv.config();
const app = express();

// CORS settings
const allowedOrigins = [
    "http://localhost:3039",
    "https://13.40.120.157:6340",
    "https://sheru.solidblackabroad.com",
    "https://admin.solidblackabroad.com",
    "http://seru-admin.solidblackabroad.com"
];

app.use(cors({
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
}));

app.options("*", cors());

// Middleware to check x-access-key header
const checkHeaderString = (req, res, next) => {
    const requiredString = "your-secret-string";
    const headerValue = req.headers["x-access-key"];

    if (headerValue === requiredString) {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: Invalid or missing header string" });
};

app.use(checkHeaderString);
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', chapterRoutes);
app.use('/api', questionRoutes);
app.use('/api', examTestRoutes);
app.use('/api', examQuestionRoutes);

// Server setup with SSL fallback
let server;
const sslPath = path.resolve(__dirname, 'ssl');
const PORT = process.env.PORT || 4000;

try {
    const privateKey = fs.readFileSync(path.join(sslPath, 'private.key'), 'utf8');
    const certificate = fs.readFileSync(path.join(sslPath, 'server.crt'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    server = https.createServer(credentials, app);
    console.log('🔒 HTTPS server starting...');
} catch (err) {
    console.warn('⚠️ SSL files not found, falling back to HTTP...');
    server = http.createServer(app);
}

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});