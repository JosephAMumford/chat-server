import WebSocket from "ws";
const nanoid = require("nanoid-esm");
import { messages } from "..";
import { wss } from "..";

export const wsCloseHandler = () => {
  console.log("Client disconnected");
};

export const wsErrorHandler = (error: any) => {
  console.log(error);
};

export const wsMessageHandler = (data: any, isBinary: boolean) => {
  console.log("received: %s", data);

  let parsed = JSON.parse(data.toString());

  let newMessage: Message = {
    content: parsed.content,
    participantId: parsed.participantId,
    id: nanoid(),
    timestamp: new Date().toString(),
    type: "MESSAGE",
  };

  let index = messages.findIndex(
    (message: Message) => message.id == newMessage.id
  );

  if (index == -1) {
    messages.push(newMessage);
    wsBroadcastMessage(wss.clients, newMessage, false);
  }
};

export const wsBroadcastMessage = (
  clients: any,
  newMessage: Message,
  isBinary: boolean
) => {
  clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newMessage), { binary: isBinary });
    }
  });
};
