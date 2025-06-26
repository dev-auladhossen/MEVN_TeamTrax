import { io } from "socket.io-client";
import { ref } from "vue";

const socket = io("http://localhost:5000"); // Backend URL

const messages = ref([]);

export function useSocket() {
  const sendMessage = (text, sender) => {
    socket.emit("send-message", { text, sender, timestamp: new Date() });
  };

  socket.on("receive-message", (data) => {
    messages.value.push(data);
  });

  return {
    socket,
    messages,
    sendMessage
  };
}
