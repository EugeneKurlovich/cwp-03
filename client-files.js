const net = require('net');
const port = 8124;

const startConnect = 'FILES';
const serverOK = 'ACK';
const serverNO = 'DEC';

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() 
{
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