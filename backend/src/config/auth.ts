import { auth } from "@colyseus/auth";

auth.backend_url = "http://localhost:2567";

const fakeDatabase = [];

auth.settings.onFindUserByEmail = async function(email) {
  return fakeDatabase.find((entry) => entry.email === email);
}

auth.settings.onRegisterWithEmailAndPassword = async function(email, password, options) {
  const entry = { email, password, ...options };
  fakeDatabase.push(entry);
  return entry;
}

auth.settings.onRegisterAnonymously = async function(options) {
  const anonymousEntry = { anonymous: true, ...options };
  return anonymousEntry;
}


auth.settings.onResetPassword = async function(email: string, password: string) {
  const entry = fakeDatabase.find((entry) => entry.email === email);
  entry.password = password;
  return true;
}

auth.settings.onEmailConfirmed = async function(email) {
  const entry = fakeDatabase.find((entry) => entry.email === email);
  entry.verified = true;
  return true;
}

// auth.oauth.addProvider('discord', {
//     key: "XXXXXXXXXXXXXXXXXX", // Client ID
//     secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Client Secret
//     scope: ['identify', 'email'],
// });
