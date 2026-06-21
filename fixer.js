const fs = require('fs');
const file = fs.readFileSync('./cfbdata.json', 'utf8');
let raw = JSON.parse(file);
let reset = {
    "properties": {
        "key": "Name"
    },
    "data": []
};
for(let ent of raw.data){
    let obj = {"seasons": []};
    for(let key of Object.keys(ent)){
        if(key != reset.properties.key){
            let seas = {"conf": []};
            seas.year = key;
            let confs = ent[key].split("/");
            for(let c of confs){
                seas.conf.push(c);
            }
            obj.seasons.push(seas);
        }else{
            obj[key] = ent[key];
        }
    }
    reset.data.push(obj);
}
for(let i = 1; i <= reset.data.length; i++){
    reset.data[i - 1].ID = i;
}
fs.writeFile('save.json', JSON.stringify(reset, null, 2), 'utf8', (err) => {
    if(err){
        console.error(err);
    }
});