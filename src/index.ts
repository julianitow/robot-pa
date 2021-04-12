import express from 'express';
import https from 'https';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

class App {

  public readonly port: number = 3000;
  public express: any;
  public server: https.Server | http.Server;

  constructor(secured: Boolean) {
    this.startHttpsServer(secured);
    this.startWssServer();
  }

  private startHttpsServer(secured: Boolean) {
    this.express = express();

    const router = express.Router();
    router.all('/', (req, res) => res.send('Welcome buddy!'));
    this.express.use('/', router);

    //  Server creation starts here
    if(secured) {
      const key = fs.readFileSync('/home/pi/cert/privkey1.pem');
      const cert = fs.readFileSync('/home/pi/cert/fullchain1.pem');
      this.server = https.createServer({ key, cert }, this.express);
    } else {
      this.server = http.createServer(this.express);
    }

    this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }

  private startWssServer() {
    console.log('WSS Server started');
    const wsServer = new WebSocket.Server({ server: this.server });
    wsServer.on('connection', ws => {
      console.log('New connection');
      ws.on('message', msg => {
        console.log('received:', msg);
        ws.send('Well received ! Over.');
      });
    });
  }
}

function main(): number {
  const app = new App(true);

  return 0;
}

main();