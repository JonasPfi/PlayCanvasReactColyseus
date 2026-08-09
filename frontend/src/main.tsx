import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css';
import App from './App.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx';

import CreateAccount from './pages/auth/CreateAccount.tsx';
import SignIn from './pages/auth/SignIn.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "/", element: <App /> },

      { path: "/sign-in", element: <SignIn /> },
      { path: "/create-account", element: <CreateAccount /> },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
