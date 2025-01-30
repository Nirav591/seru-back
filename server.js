const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', chapterRoutes); // Add chapter routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});