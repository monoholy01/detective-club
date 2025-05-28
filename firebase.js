// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// Replace with your own Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function joinRoom(room, playerName) {
  const playerRef = ref(db, `rooms/${room}/players`);
  const newPlayerRef = push(playerRef);
  await set(newPlayerRef, playerName);
  return "Joined room!";
}

export function createRoom(room) {
  const roomRef = ref(db, `rooms/${room}`);
  set(roomRef, { players: [], rounds: [] });
}

export function observePlayers(room, callback) {
  const playersRef = ref(db, `rooms/${room}/players`);
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    const names = data ? Object.values(data) : [];
    callback(names);
  });
}

export function startRound(room, clue) {
  const roundRef = ref(db, `rooms/${room}/currentRound`);
  const noClueIndex = Math.floor(Math.random() * 1000) % 5;
  set(roundRef, { clue, noClueIndex });
}
