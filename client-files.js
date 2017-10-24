const net = require('net'); 
const path = require('path'); 
const port = 8124; 
const ASK = 'ASK'; 
const DEC = 'DEC'; 
const FILES = 'FILES'; 
let fs = require('fs'); 
let isFILES = false; 

let files = []; 
let counter  = 0;


function ReadFilesInDirectory(dirPath,callback) { 

    fs.readdir(path.normalize(dirPath), function (err, filess) {
        console.log(filess);
        filess.forEach(function (item) {
            fs.stat(path.normalize(dirPath + path.sep + item), function (err, stat) {
                if (stat.isDirectory()) {
                    ReadFilesInDirectory(dirPath + path.sep + item);
                }
                else if (stat.isFile() ) {
                    files.push(dirPath + path.sep + item);
                }
            })
           callback();
        });
    });
} 



let directories = process.argv.slice(2); 
     directories.forEach((value) => { 
    ReadFilesInDirectory(value, function()
    {
            console.log("End!!!");
    });
});


const client = new net.Socket(); 

function sendFile() { 
    let filePath = files.pop();
    client.setNoDelay(true);
    fs.readFile(filePath, function (err, data) {
        client.write(data.toString('base64') + '{', function () {
            client.write(path.basename(filePath) + '{', function () {
                client.write("FEND" + '{', function () { });
            });
        });
    });
} 

client.setEncoding('utf8'); 


       
client.connect(port, function () {   
    console.log('Connected');
    client.write(FILES);
}); 
    

client.on('data', function (data) { 
    if (data === ASK && !isFILES) {
        isFILES = true;
        sendFile();
} 
    if (files.length === 0) {
        client.destroy();
    }
    else if (data === "File saved" && files.length !== 0 && isFILES) {
        sendFile();
    }
}); 

client.on('close', function () { 
    console.log('Connection closed');
});