const net = require('net'); 
const path = require('path'); 
const port = 8124; 
let seed = 0;
const QA = 'QA';
const DEC = 'DEC';
const ASK = 'ASK';
const FILES = 'FILES';
let fs = require('fs'); 
let files = [];
let indexOfFile = 0;
let savedir = './save'
const server = net.createServer((client) => {
    let File;
    let isQA = false;
    let isFILES = false;

    client.id = Date.now() + ++seed;
    client.setEncoding('utf8');

    console.log('Client connected. Client ID: ' + client.id);

    client.on('data', (data) => {
        if (data === QA) {
            isQA = true;
            client.write(ASK);
        }
        if (data === FILES) {
            files[client.id] = [];
            fs.mkdir(savedir + path.sep + client.id,
            function (err) {
                if (err) {
                console.log(err);
            }
             client.write(ASK);
            });
            isFILES = true;
           
        }
        else if (data === DEC) {
        client.write(DEC);
        client.destroy();
        console.log('Client' + client.id + ' disconnected');
        }

        else if (data !== FILES && data !== QA && isFILES) {
            files[client.id].push(data.toString());
            if (data.toString().endsWith("FEND{")) {
                let info = files[client.id].toString().split('{');
                info.pop();
                let buffer = Buffer.from(info[0], 'base64');
                fs.writeFile(savedir+ path.sep + client.id + path.sep + client.id + "_" + info[1], buffer, function () {
                    info = [];
                    files[client.id] = [];
                    client.write("File saved");
                });
            }
        }
    });
    client.on('end', () => console.log('Client disconnected'));
}); 

server.listen(port, () => { 
    console.log(`Server listening on localhost:${port}`);
}); 
