const express = require('express')
const app = express()
const port = 3000
const os = require("os");
const hostname = os.hostname();
const envVar = process.env.SECRET || 'Empty secret'

app.get('/', (req, res) => {
    return res.send(`Hello World from ${hostname} and secret is '${envVar}'`)
})

app.listen(port, () => console.log(`Simple service app listening on port ${port}!`))
