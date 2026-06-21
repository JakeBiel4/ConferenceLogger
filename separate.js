const fs = require('fs');
let field = fs.readFileSync('save.json', 'utf8');
field = JSON.parse(field);
for(let entry of field.data){
    let school = {
        "properties": {
            "key": [
                "Name",
                "ID"
            ],
            "format": "CFB"
        }
    };
    school.data = entry;
    fs.writeFileSync('./data/' + entry.Name + '.json', JSON.stringify(school));
}