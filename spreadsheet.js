const fs = require('fs');
const express = ('express');
const app = express();
const PORT = process.env.PORT || 5150;
app.use(express.json());
app.use(express.static('public'));
let field = {};
app.post('/set', (req, res) => {
    field = req.body.file.json();
})
app.post('/add', (req, res) => {
    let check = false;
    for(let i = 0; i < field.data.length; i++){
        if(field.data[i][field.properties.key] == req.body.school){
            if(Object.hasOwn(field.data[i], req.body.year)){
                let yConf = field.data[i][req.body.year];
                yConf = yConf + "/" + req.body.conf;
                field.data[i][req.body.year] = yConf;
            }else{
                field.data[i][req.body.year] = req.body.conf;
            }
            check = true;
        }
        if(check){
            break;
        }
    }
    if(!check){
        let entry = {
            "Name": req.body.school
        }
        for(let i = 1869; i < req.body.year; i++){
            entry[i] = "None";
        }
        entry[req.body.year] = req.body.conf;
        field.data.push(entry);
    }else{
        check = false;
    }
});
app.post('/fill', (req, res) => {
    for(let i = 0; i < field.data.length; i++){
        if(!Object.hasOwn(field.data[i], req.body.year)){
            field.data[i][req.body.year] = "None";
        }
    }
});
app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});