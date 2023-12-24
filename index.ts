import express, { Express } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { HTTP_PORT, WEBSOCKET_PORT } from "./lib/constants";
import {
  wsCloseHandler,
  wsErrorHandler,
  wsMessageHandler,
} from "./lib/wsHandlers";
const dotenv = require("dotenv");

dotenv.config();

const app: Express = express();

app.use(
  cors({
    credentials: true,
    preflightContinue: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: true,
  })
);

export let messages: Message[] = [];

const server = app.listen(HTTP_PORT, `${process.env.HOST}`, async () => {
  console.log(`[server]: Running at http://${process.env.HOST}:${HTTP_PORT}`);
});

process.on("SIGINT", async () => {
  console.log("[server] Closing Server");
  server.close();
});

export const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
});

wss.on("connection", function connection(ws) {
  ws.on("close", wsCloseHandler);

  ws.on("error", wsErrorHandler);

  ws.on("message", wsMessageHandler);

  ws.send(
    JSON.stringify({
      content: "system:Connected",
      timestamp: new Date().toString(),
      type: "EVENT",
    } as SystemMessage)
  );
});
