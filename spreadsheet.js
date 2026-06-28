const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5150;
let docs = fs.readdirSync('./data');
let point = fs.readFileSync('./states.json', 'utf8');
point = JSON.parse(point);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/add', (req, res) => {
    let found = false;
    for(let dName of docs){
        let doc = fs.readFileSync('./data/' + dName, 'utf8');
        doc = JSON.parse(doc);
        if(req.body.Name == doc.data.Name && req.body.state == doc.data.state.code){
            let newYear = false;
            for(let i = 0; i < doc.data.seasons.length; i++){
                if(doc.data.seasons[i].year == req.body.year){
                    doc.data.seasons[i].conf.push(req.body.conf);
                    newYear = true;
                    break;
                }
            }
            if(!newYear){
                let season = {
                    "conf": [],
                    "year": req.body.year
                };
                season.conf.push(req.body.conf);
                doc.data.seasons.push(season);
            }
            found = true;
        }
        if(found){
            fs.writeFileSync('./data/' + dName, JSON.stringify(doc, null, 2));
            break;
        }
    }
    if(!found){
        let file = {
            "properties": {
                "key": [
                    "Name",
                    "ID"
                ],
                "format": "CFB"
            },
            "data": {
                "seasons": [],
                "Name": req.body.Name,
                "ID": docs.length + 1
            }
        };
        for(let i = 1869; i < req.body.year; i++){
            let y = {
                "conf": [],
                "year": i
            };
            y.conf.push("None");
            file.data.seasons.push(y);
        }
        let current = {
            "conf": [],
            "year": req.body.year
        };
        current.conf.push(req.body.conf);
        file.data.seasons.push(current);
        for(let state of point.states){
            if(state.code == req.body.state){
                file.state = state;
                break;
            }
        }
        let exists = false;
        let prototype = file.data.Name + '.json';
        for(let dName of docs){
            if(dName == prototype){
                let withState = './data/' + file.data.Name + ' (' + file.data.state.code + ').json';
                fs.writeFileSync(withState, JSON.stringify(file, null, 2));
                exists = true;
                break;
            }
        }
        if(!exists){
            fs.writeFileSync('./data/' + file.data.Name + '.json', JSON.stringify(file, null, 2));
        }
        docs = fs.readdirSync('./data');
    }
});
app.post('/fill', (req, res) => {
    for(let name of docs){
        if(fs.statSync('./data/' + name).isFile){
            let check = false;
            let obj = fs.readFileSync('./data/' + name, 'utf8');
            obj = JSON.parse(obj);
            for(let i = 0; i < obj.data.seasons.length; i++){
                if(obj.data.seasons[i].year == req.body.year){
                    check = true;
                    break;
                }
            }
            if(!check){
                let current = {
                    "conf": [],
                    "year": req.body.year
                };
                current.conf.push("None");
                obj.data.seasons.push(current);
            }
            fs.writeFileSync('./data/' + name, JSON.stringify(obj, null, 2));
        }
    }
});
app.get('/states', (req, res) => {
    res.json(point);
})
app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});