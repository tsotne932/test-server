const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 7777;

app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.json("hello")
})

app.post('/register', (request, response) => {
    // response.send('Hello akaki!')
    let result = request.body;
    result.id = 1234567;
    response.json(result);
})

app.get('/logout', (req, res) => {
    res.send('Hello tsotne!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})