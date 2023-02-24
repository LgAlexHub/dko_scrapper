const fs = require('fs');
const csvwriter = require('csv-writer');
const path = require('path');

/**
 * Parse content of json file
 * @param {string} path 
 * @returns {Object}
 */
function readJSON(path) {
    return JSON.parse(fs.readFileSync(path));
}

/**
 * Write json from JS object
 * @param {array} arrayOfJsonObject 
 * @param {string} path 
 */
function writeJSON(arrayOfJsonObject, path) {
    var jsonString = JSON.stringify(arrayOfJsonObject, null, 2);
    fs.writeFile(path, jsonString, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
    console.log('Data uploaded into json successfully at ' + path)
}


/**
 * Write CSV file from JS object
 * @param {string} path 
 * @param {array} column [{id: property_name, title: name appear on csv}] 
 * @param {Object} data 
 */
function writeCSV(path, columns, data) {
    var createCsvWriter = csvwriter.createObjectCsvWriter
    const csvWriter = createCsvWriter({
        path: path,
        header: columns
    });
    csvWriter
        .writeRecords(data)
        .then(() => console.log('Data uploaded into csv successfully at ' + path));
}

/**
 * @returns {string}  project root path 
 */
function rootPath() {
    return path.dirname(require.main.filename);
}

/**
 * @param {int} ms time in milliseconds 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the most recent file in a dir
 * @param {string} path 
 * @returns {Object}
 */
function getMostRecentFile(pathDir) {
    let files = fs.readdirSync(pathDir)
        .filter(file => fs.lstatSync(path.join(pathDir, file)).isFile())
        .map(file => ({ file, mtime: fs.lstatSync(path.join(pathDir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return files.length ? files[0] : undefined;
}

/**
 * Get files list in dir
 * @param {string} path 
 * @returns {array}
 */
function getFileList(path){
    return fs.readdirSync(path);
}

/**
 * Return today string (dd_mm_yyyy format) 
 * @returns {string}
 */
function todayDateToString(){
    let date = new Date();
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
}




module.exports = {
    readJSON,
    writeJSON,
    writeCSV,
    rootPath,
    sleep,
    getFileList,
    getMostRecentFile,
    todayDateToString,
}