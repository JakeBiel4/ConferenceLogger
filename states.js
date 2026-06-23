const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'states')));
let files = fs.readdirSync('./data');
let point = {};
app.get('/start', (req, res) => {
    point = fs.readFileSync('./states.json', 'utf8');
    point = JSON.parse(point);
    let obj = fs.readFileSync('./data/' + files[point.count], 'utf8');
    obj = JSON.parse(obj);
    res.json(JSON.stringify({
        "Name": obj.data.Name
    }));
});
app.post('/next', (req, res) => {
    let obj = fs.readFileSync('./data/' + files[point.count], 'utf8');
    obj = JSON.parse(obj);
    obj.data.state = req.body.loci;
    fs.writeFileSync('./data/' + files[point.count], JSON.stringify(obj, null,2));
    point.count = point.count + 1;
    console.log(files[point.count]);
    let next = fs.readFileSync('./data/' + files[point.count], 'utf8');
    next = JSON.parse(next);
    res.json(JSON.stringify({
        "Name": next.data.Name
    }));
});
app.get('/save', (req, res) => {
    fs.writeFileSync('./states.json', JSON.stringify(point, null, 2));
});
app.post('/encode', (req, res) => {
    point.states = req.body.states;
    fs.writeFileSync('./states.json', JSON.stringify(point, null, 2));
});
app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});