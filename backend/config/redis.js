import { createClient } from "redis";

const client = createClient({
  socket: {
    host: "localhost", // Address of your host machine
    port: 9090,        // Port mapped from Docker
  },
  password: "mypassword", // Password set in Docker
});

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error("Redis connection error:", err));

export default client;
