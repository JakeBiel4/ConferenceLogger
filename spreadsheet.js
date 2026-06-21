const fs = require('fs');
const express = ('express');
const app = express();
const PORT = process.env.PORT || 5150;
app.use(express.json());
app.use(express.static('public'));
let field = {};
app.post('/set', (req, res) => {
    if(req.body.file.properties.format == "CFB"){
        field = req.body.file.json();
    }else{
        res.json(JSON.stringify({
            "error": "invalid format"
        }));
    }
});
app.post('/add', (req, res) => {
    if(!(Object.keys(field).length === 0)){
        let check = false;
        for(let i = 0; i < field.data.length; i++){
            if(field.data[i][field.properties.key] == req.body.Name){
                if(field.data[i].seasons[field.data[i].seasons.length - 1].year == req.body.year){
                    field.data[i].seasons[field.data[i].seasons.length - 1].conf.push(req.body.conf);
                }else{
                    let current = {
                        "year": req.body.year,
                        "conf": []
                    };
                    current.conf.push(req.body.conf);
                    field.data[i].seasons.push(current);
                }
                check = true;
                break;
            }
        }
        if(!check){
            let obj = {"seasons": []};
            obj.Name = req.body.Name;
            obj.ID = field.data[field.data.length - 1].ID + 1;
            for(let j = 0; j < field.data[field.data.length - 1].seasons.length; j++){
                if(field.data[field.data.length - 1].seasons[j].year != req.body.year){
                    obj.seasons.push({
                        "year": field.data[field.data.length - 1].seasons[j].year,
                        "conf": ["None"]
                    });
                }
            }
            let current = {
                "year": req.body.year,
                "conf": []
            };
            current.conf.push(req.body.conf);
            obj.seasons.push(current);
            field.data.push(obj);
        }
    }else{
        res.json(JSON.stringify({
            "error": "no data loaded"
        }));
    }
});
app.post('/fill', (req, res) => {
    for(let i = 0; i < field.data.length; i++){
        if(!Object.hasOwn(field.data[i], req.body.year)){
            field.data[i][req.body.year] = "None";
        }
    }
});
app.get('/save', (req, res) => {
    res.json(field);
});
app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});