require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require('express')
const app = express()

const cors = require("cors")
const dbConnection = require('./config/dbConnection')


app.use(express.json())
app.use(cors())


dbConnection()

app.get("/",(req,res)=>{
res.send("Hello")
})
 


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
    
})

