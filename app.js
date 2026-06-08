require("dotenv").config()
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.static("public"))

const authRoutes = require("./routers/authRoutes")
const userRoutes = require("./routers/userRoutes");
const postRoutes = require("./routers/postRoutes");
const requestRoutes = require("./routers/requestRoutes");
const projectRoutes = require("./routers/projectRoutes");
const reportRoutes = require("./routers/reportRoutes");


app.use("/api/auth",authRoutes)
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/projects", projectRoutes)

const db = require("./config/db")

app.listen(port, ()=>{
    console.log(`Your Server is running at http://localhost:${port}`)
})