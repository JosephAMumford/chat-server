type Message = {
  content: string | SystemEvent;
  id?: string;
  participantId?: string;
  timestamp: string;
  type: MessageType;
};

type MessageType = "EVENT" | "MESSAGE";

type SystemEvent = "system:Connected" | "system:Disconnected" | "system:Typing";

type SystemMessage = {
  content: SystemEvent;
  timestamp: string;
  type: "EVENT";
};
