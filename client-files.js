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
    if (data === serverOK) 
    {
        console.log("Connected is open");




         client.destroy();
    }
    

    else if (data === serverNO) 
    {
        console.log(data);
        console.log("Connected is close");
        console.log("Disconnected");
        client.destroy();

    }


});


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