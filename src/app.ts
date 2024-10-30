import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/",
  cors: {
    origin: "*",
  },
});

const chats: any = [];

const generateChatId = () => {
  return Math.floor(Math.random() * 1000000);
};
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join-chat", (data) => {
    console.log(data);
    const findChat = chats.find((chat: any) => chat == data.chatId);
    console.log(findChat);
    console.log(chats);
    if (findChat) {
      socket.join(data.chatId);
      io.to(data.chatId).emit("joined-chat", data);
    } else {
      const newChatId = generateChatId();
      chats.push(newChatId);
      socket.join(newChatId.toString());
      socket.emit("joined-chat", { chatId: newChatId.toString() });
    }
  });

  socket.on("chat", (data) => {
    console.log(data);
    chats.push(data);
    io.to(data.chatId).emit("chat", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export default httpServer;
