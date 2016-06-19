#!/usr/bin/env node
var config = require('../config/config.js')
console.log("updating zipcode database")
var fs = require('fs'),
    path = require('path'),
    zips = [], str,
    data = fs.readFileSync(__dirname+config.ZIP_CODE_DATABASE, 'utf8').replace(/\r/g, '').split('\n');

data.shift();


var clean = function(str) {
    return str.replace(/"/g, '').trimLeft();
}

var ucfirst = function(str) {
    str = str.toLowerCase();
    var lines = str.split(' ');
    lines.forEach(function(s, i) {
        var firstChar      = s.charAt(0),
            upperFirstChar = firstChar.toUpperCase();

        lines[i] = upperFirstChar + s.substring(1);
        
    });
    return lines.join(' ');
};

data.forEach(function(line, num) {
    line = line.split(',');
    if (line.length > 1) {
        var o = {};

        o.zipcode = clean(line[1]);
        o.latitude = Number(clean(line[6]));
        o.longitude = Number(clean(line[7]));
        o.city = ucfirst(clean(line[3]));
        o.state = clean(line[4]);
        zips.push(o)
    }
});



var stateMap = {};

for (var i in zips) {
    var item = zips[i];
    stateMap[item.state] = stateMap[item.state] || [];

    stateMap[item.state].push(item.zip);
}

str = 'exports.codes = ' + JSON.stringify(zips) + ';\n';
str += 'exports.stateMap = ' + JSON.stringify(stateMap) + ';\n';
str = JSON.stringify(zips)
fs.writeFileSync('./node_modules/cities/locations.json', str, 'utf8');


console.log("downloading crcd dataset")

function DownloadAndUnzip(URL,path){

    var unzip = require('unzip');
    var http = require('http');
    var request = http.get(URL, function(response) {
        console.log("unzipping crcd dataset")
        response.pipe(unzip.Extract({path:__dirname+path}))
    });
}

DownloadAndUnzip(config.CRCD_DOWNLOAD_URL,config.CRCD_DOWNLOAD_FILE_LOCATION)

