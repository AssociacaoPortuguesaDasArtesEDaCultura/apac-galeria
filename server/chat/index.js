const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { join } = require('node:path');

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  console.log(`Primary ${process.pid} is running of`, numCPUs , 'CPUs')
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  
  // set up the adapter on the primary thread
  return setupPrimary();
}

async function main() { // open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server,{
    cors: {
      origin: "http://localhost:5173"
    },
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter()
  });

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  console.log('Server listening on port ' + process.env.PORT);

  io.on('connection', async (socket) => {
      console.log('A user connected');

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
      
      // Handle chat events here
      socket.on('chat message', async (msg, clientOffset, callback) => {
        console.log('Message received: ' + msg, process.env.PORT);

        let result;
        try {
          // store the message in the database
          result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
        } catch (e) {
          if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
            // the message was already inserted, so we notify the client
            callback();
          } else {
            // nothing to do, just let the client retry
          }
          return;
        }
        // include the offset with the message
        io.emit('chat message', msg, result.lastID);

        // acknowledge the event
        callback();
      });

      if (!socket.recovered) {
        // if the connection state recovery was not successful
        try {
          await db.each('SELECT id, content FROM messages WHERE id > ?',
            [socket.handshake.auth.serverOffset || 0],
            (_err, row) => {
              socket.emit('chat message', row.content, row.id);
            }
          )
        } catch (e) {
          // something went wrong
        }
      }
  });

  io.on('disconnect', () => {
      console.log('A user disconnected');
  });

  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });

}

main();