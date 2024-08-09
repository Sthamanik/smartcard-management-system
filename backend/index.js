const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.DB_URL)
.then(() => console.log("connected to Mongo"))
.catch((err) => console.error("Error connecting to Mongo", err))

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

// routes
app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/attendance'))

app.get('/', (req, res) => {
  res.send('Welcome to ASMT')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})