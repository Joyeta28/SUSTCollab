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


app.use("/api/auth",authRoutes)
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/requests", requestRoutes);

const db = require("./config/db")

app.listen(port, ()=>{
    console.log(`Your Server is running at http://localhost:${port}`)
})