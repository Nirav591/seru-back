const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const chapterRoutes = require("./routes/chapter.routes");
app.use("/api/chapters", chapterRoutes);

const PORT = process.env.PORT || 6320;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));