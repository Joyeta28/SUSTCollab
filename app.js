require("dotenv").config()
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.static("public"))

const authRoutes = require("./routers/authRoutes")
const userRoutes = require("./routers/userRoutes");


app.use("/api/auth",authRoutes)
app.use("/api/user", userRoutes);

const db = require("./config/db")

app.listen(port, ()=>{
    console.log(`Your Server is running at http://localhost:${port}`)
})