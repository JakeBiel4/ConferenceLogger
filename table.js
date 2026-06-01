const fs = require('fs');
const excel = require('exceljs');
let table = {
    "seasons": []
};
async function loadExcel(){
    const book = new excel.Workbook();
    await book.xlsx.readFile("CFBDatabase.xlsx");
    const sheet = book.getWorksheet(1);
    let count = sheet.rowCount;
    for(let i = 1869; i < 1926; i++){
        let col = i = 1868;
        let season = {
            "year": i,
            "schools": []
        };
        for(let j = 1; j <= sheet.rowCount; j++){
            season.schools.push({
                "name": sheet.getRow(j).getCell(1),
                "conference": sheet.getRow(j).getCell(col)
            });
        }
        table.seasons.push(season);
    }
    console.log(table);
}
loadExcel();