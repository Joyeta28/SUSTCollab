require("dotenv").config()
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

const db = require("./config/db")

app.listen(port, ()=>{
    console.log(`Your Server is running at http://localhost:${port}`)
})