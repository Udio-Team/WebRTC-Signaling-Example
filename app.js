const WebSocket = require('ws');
const UserManager = require('./config/UserManager');

var userManager = new UserManager();

function decode(buffer) {
    return JSON.parse(buffer.toString())
}

function encode(json) {
    return Buffer.from(JSON.stringify(json))
}

const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Signaling server is now listening on port 8080");
});

// Broadcast to all.
wss.broadcast = (ws, data) => {
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    })
};

wss.broadcastButMe = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Send to particular client
wss.sendTo = (ws, email, data) => {
    wss.clients.forEach(client => {
        if(client.user.email === email && client.readyState === WebSocket.OPEN) {
            console.log('Sending!!!');
            client.send(data);
        }
    })
}

wss.on('connection', (ws) => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`);
    
    ws.onmessage = (message) => {

        let data = decode(message.data); // decode

        // If it's an sdp we want to send it only to the user they're trying to connect to
        if(data.type === 'SessionDescription') {
            console.log(data);
            console.log(`Sending sdp to: ${data.toUser.email}`);
            wss.sendTo(ws, data.toUser.email, encode(data));
            return
        }

        if(data.type === 'IceCandidate') {
            wss.broadcastButMe(ws, encode(data));
            return
        }

        // Decode and add users email to the websocket
        userManager.addUser(data.payload.user.email, data.payload.user.isLive); // add user to user manager class
        data.payload['users'] = userManager.users; // attach all users to response
        ws.user = data.payload.user // attach user's email to websocket

        wss.broadcast(ws, encode(data));
    }

    ws.onclose = () => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
        userManager.removeUser(ws.user.email);
        wss.broadcast(null, encode({
            payload: { type: 'update', user: ws.user, users: userManager.users },
            type: 'UserDescription'
        }))
    }
});