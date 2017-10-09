const net = require('net');
const port = 8124;

const serverOK = 'ACK';
const serverNO = 'DEC';
const startConnect = 'FILES';
let counter = 0;


const server = net.createServer((client) => 
{
 client.setEncoding('utf8');

client.on('data',ConnectUsers);

 function ConnectUsers(data, err) 
    {
        if (!err)
         {
            if (data === startConnect) 
            {
                    client.id = getId();
               
                    console.log(client.id + "  connected");
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


server.listen(port, () => {
  console.log("Server listening on localhost: " + port);
});