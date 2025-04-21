const express = require('express');
const app = express();
const chapterRoutes = require('./routes/chapter.routes');

app.use(express.json()); // parse JSON body
app.use('/api', chapterRoutes); // base route for chapter APIs

const PORT = 6340;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));