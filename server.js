const net = require('net');
const fs = require('fs');
const port = 8124;
const path = require('path');
const serverOK = 'ACK';
const serverNO = 'DEC';
const startConnect = 'FILES';
let counter = 0;
let Clients = [];
let filesClientsValue = 0; 
let filesChanks = [];
const sendNextFile = 'NEXTFILE';
const endSendingFile = "ENDFILE";
const bufferSeparator = '|||||';

const recvFilesDirpath = process.env.FILESDIR +  'files';


const server = net.createServer((client) => 
{
 client.setEncoding('utf8');

client.on('data',ConnectUsers);
    client.on('data', ClientDialogFILES);



 function ConnectUsers(data, err) 
    {
         if (!err) {
            if (client.id === undefined && (data.toString() ===  startConnect)) {
                client.id = getId() ;
                Clients[client.id] = data.toString();                                               

                if (Clients[client.id] === startConnect) {
    
                        createDir("E://PSCP//lr4//files//" + client.id.toString());
                        filesChanks[client.id] = [];
              
                }
                  console.log('Client ' + client.id + " connected: " + Clients[client.id]);
                client.write(serverOK);
            }
        } 
         else 
         {
            client.write(serverNO);
            client.write(err);
        }
    }


    function ClientDialogFILES(data, err) {
        if (!err) {
            if (Clients[client.id] === startConnect && data.toString() !== startConnect) {

                let bufferChank = Buffer.from(data);
                filesChanks[client.id].push(bufferChank);

                if (data.toString().endsWith(endSendingFile)) {
                    createFileFromBinData(client.id);
                    client.write(sendNextFile);
                }

            }
        }

    }


});


function createFileFromBinData(id) {

    let fileData = Buffer.concat(filesChanks[id]);
    let separatorIndex = fileData.indexOf(bufferSeparator);                                                         //data....\r\t\ePathEnFilNDFILE
    let fileName = fileData.slice(separatorIndex).toString().split(bufferSeparator)[1];

    fs.writeFile("E://PSCP//lr4//files//" + id + "//" + fileName, fileData.slice(0,separatorIndex), function (err) {
            if (err)
                console.error(err);
        }
    );
    filesChanks[id]=[];
}

function getId()
{
    return ++counter;
}

function createDir(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

server.listen(port, () => {
  console.log("Server listening on localhost: " + port);
});