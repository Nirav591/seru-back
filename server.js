const express = require('express');
const app = express();
const chapterRoutes = require('./routes/chapter.routes');

app.use(express.json()); // parse JSON body
app.use('/api', chapterRoutes); // base route for chapter APIs

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));