const express = require('express');
const app = express();
const chapterRoutes = require('./routes/chapter.routes');
const questionRoutes = require('./routes/question.routes');
const examRoutes = require('./routes/exam.routes');
const cors = require('cors');


app.use(cors());


app.use(express.json()); // parse JSON body
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use('/api', chapterRoutes);
app.use('/api', questionRoutes);
app.use('/api', examRoutes);

const PORT = 6340;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));