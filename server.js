const net = require('net');
const fs = require('fs');
const port = 8124;
const path = require('path');
const serverOK = 'ACK';
const serverNO = 'DEC';
const startConnect = 'FILES';
let counter = 0;
let Clients = [];
let ammountClients = 0; 
let Bfiles = [];
const NextFile = 'NEXTFILE';
const endSend = "ENDFILE";
const Separator = '|||||';

process.env.FILESDIR = "E://PSCP//lr4//files//";
process.env.MAX = 2;


const server = net.createServer((client) => 
{
 client.setEncoding('utf8');

client.on('data',ConnectUsers);
client.on('data', getFiles);



 function ConnectUsers(data) 
    {       

if (client.id) return;

            if (client.id === undefined && (data.toString() ===  startConnect)) {
                client.id = getId() ;
                Clients[client.id] = data.toString();                                               

                if (Clients[client.id] === startConnect) {
                       if (ammountClients++ < process.env.MAX) 
                       {
                        createDir(process.env.FILESDIR + client.id.toString());
                        Bfiles[client.id] = [];
                       }
                       else throw " >2 clients "

              
                }
                  console.log('Client ' + client.id + " connected: " + Clients[client.id]);
                client.write(serverOK);
          
        } 
         else 
         {
            client.write(serverNO);
        }
    }


    function getFiles(data) {
     
            if (Clients[client.id] === startConnect && data.toString() !== startConnect) {

                let buffer = Buffer.from(data);
                Bfiles[client.id].push(buffer);

                if (data.toString().endsWith(endSend)) 
                {
                    SaveFiles(client.id);
                    client.write(NextFile);
                }

            }
        

    }


});


function SaveFiles(id) 
{
    let fileData = Buffer.concat(Bfiles[id]);
    let separatorIndex = fileData.indexOf(Separator);                                                        
    let fileName = fileData.slice(separatorIndex).toString().split(Separator)[1];

    fs.writeFile(process.env.FILESDIR + id + "//" + fileName, fileData.slice(0,separatorIndex), function (err) {
            if (err)
                console.error(err);
        }
    );
    Bfiles[id]=[];
}

function getId()
{
    return ++counter;
}

function createDir(path)
{
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

server.listen(port, () => {
  console.log("Server listening on localhost: " + port);
});