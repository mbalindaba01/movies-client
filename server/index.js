const express = require('express')
const app = express()
const route = require('./routes/movieRoutes')

app.use(express.json())

app.use('/movies', route)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Server running at port ' + PORT))