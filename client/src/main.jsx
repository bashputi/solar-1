import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import myRouter from './route/Router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './provider/socket';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <SocketProvider>
        <GoogleOAuthProvider clientId="176265386758-0efb84uh7k77k1cjtlqmecand83k5789.apps.googleusercontent.com">
          <RouterProvider router={myRouter} />
        </GoogleOAuthProvider>
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
