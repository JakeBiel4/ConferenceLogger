const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5150;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/add', (req, res) => {
    fs.readFile('./data/' + req.body.Name + '.json', 'utf8', (err, data) => {
        if(err){
            if(err.code ==='ENOENT'){
                const files = fs.readdirSync('./data');
                let obj = {
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
                        "ID": files.length
                    }
                };
                for(let i = 1869; i < req.body.year; i++){
                    obj.data.seasons.push({
                        "conf": ["None"],
                        "year": i
                    });
                }
                let current = {
                    "conf": [],
                    "year": req.body.year
                };
                current.conf.push(req.body.conf);
                obj.data.seasons.push(current);
                fs.writeFileSync('./data/' + req.body.Name + '.json', JSON.stringify(obj, null, 2));
            }
        }else{
            let check = false;
            let obj = fs.readFileSync('./data/' + req.body.Name + '.json', 'utf8');
            obj = JSON.parse(obj);
            for(let i = 0; i < obj.data.seasons.length; i++){
                if(obj.data.seasons[i].year == req.body.year){
                    obj.data.seasons[i].conf.push(req.body.conf);
                    check = true;
                    break;
                }
            }
            if(!check){
                let current = {
                    "conf": [],
                    "year": req.body.year
                };
                current.conf.push(req.body.conf);
                obj.data.seasons.push(current);
            }
            fs.writeFileSync('./data/' + req.body.Name + '.json', JSON.stringify(obj, null, 2));
        }
    });
});
app.post('/fill', (req, res) => {
    let files = fs.readdirSync('./data');
    files.forEach((name) => {
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
    });
});
app.get('/states', (req, res) => {
    let point = fs.readFileSync('./states.json');
    point = JSON.parse(point);
    res.json(point);
})
app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});