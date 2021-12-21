import React from 'react';
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import 'styles/App.scss';
import { routes } from 'routes';
import { RecoilRoot } from 'recoil';
import Toaster from 'components/Toaster';
import { io } from 'socket.io-client';

export const socketClient = io(process.env.REACT_APP_BACKEND_URL!, {
  transports: ['websocket'],
  // withCredentials: true
})

function App() {
  return (
    <RecoilRoot>
      <Toaster />
      <Routes>
        {
          routes.map(([path, Element], i) =>
            <Route path={path} element={<Element />} key={i} />
          )
        }
      </Routes>
    </RecoilRoot>
  );
}

export default App;
