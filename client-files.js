const net = require('net');
const port = 8124;
const fs = require('fs');
const path = require('path');
const startConnect = 'FILES';
const serverOK = 'ACK';
const serverNO = 'DEC';
let allFiles = [];
const nextFileStatus = 'NEXTFILE';
const client = new net.Socket();
const bufferSep = '|||||';

const endSendingFile = "ENDFILE";

client.setEncoding('utf8');

client.connect(port, function() 
{
    console.log("Input Dir: ");

        for (let i = 0; i < process.argv.length- 2; i ++)
        {
        console.log("Path: " + process.argv[i+2]);
        }
    
     getDirectory().forEach((i) => {
        readFiles(i);
    });

        client.write(startConnect);   
});


client.on('data', function(data) {
    if (data === serverOK || data == nextFileStatus) 
    {
        console.log("Connected is open");
        sendNextFile()


    }
    

    else if (data === serverNO) 
    {
        console.log(data);
        console.log("Connected is close");
        console.log("Disconnected");
        client.destroy();

    }


});


function sendNextFile() {
    if (allFiles.length !== 0) {

        let tmpFileName = allFiles.shift();

        fs.readFile(tmpFileName, (err, data) => {

            client.write(data);
            client.write(bufferSep + path.basename(tmpFileName));
            client.write(bufferSep + endSendingFile);

        });
    } else {
        client.end();
    }
}

function readFiles(file) {
    fs.readdirSync(file).forEach((i) => {

        let filePath = path.normalize(file + '\\' + i);
        if (fs.statSync(filePath).isFile()) {
            allFiles.push(filePath);
        }
        else {
            readAllFilesNames(filePath);
        }
    })
}


function getDirectory() 
{
    return process.argv.slice(2);
}