import { Client } from "@colyseus/sdk";

// detect if we're running on localhost
const endpoint = (window.location.href.indexOf("localhost") >= 0 || window.location.href.indexOf("127.0.0.1") >= 0)
  ? "http://localhost:2567"
  : "https://" + window.location.hostname;

// Single client instance, shared by every room connection in the app
// (auth, the main game room, and any additional room types you add later).
export const client = new Client(endpoint);
