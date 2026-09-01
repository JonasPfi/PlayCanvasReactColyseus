import { auth } from "@colyseus/auth";

auth.backend_url = process.env.URL;

//TODO: Replace with real database
const fakeDatabase = [];

auth.settings.onFindUserByEmail = async function(email) {
  return fakeDatabase.find((entry) => entry.email === email);
}

auth.settings.onRegisterWithEmailAndPassword = async function(email, password, options) {
  const entry = { email, password, ...options };
  fakeDatabase.push(entry);
  return entry;
}
