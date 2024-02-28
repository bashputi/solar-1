import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import myRouter from './route/Router';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="176265386758-0efb84uh7k77k1cjtlqmecand83k5789.apps.googleusercontent.com">
    <RouterProvider router={myRouter} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
