const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const chapterRoutes = require("./routes/chapter.routes");
const questionRoutes = require("./routes/question.routes");
const examRoutes = require("./routes/exam.routes");


app.use("/api/questions", questionRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/exams", examRoutes);

const PORT = 6340;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));