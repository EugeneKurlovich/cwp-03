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

const recvFilesDirpath = process.env.FILESDIR +  'files';


const server = net.createServer((client) => 
{
 client.setEncoding('utf8');

client.on('data',ConnectUsers);




 function ConnectUsers(data, err) 
    {
         if (!err) {
            if (client.id === undefined && (data.toString() ===  startConnect)) {
                client.id = getId() ;
                Clients[client.id] = data.toString();                                               //тип клиента QA/FILES по его id

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


});


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