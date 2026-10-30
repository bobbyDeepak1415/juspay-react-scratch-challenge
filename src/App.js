import React from 'react';
import { ScratchProvider } from './context/ScratchContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Stage from './components/Stage';

export default function App() {
  return (
    <ScratchProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Workspace />
          <Stage />
        </div>
      </div>
    </ScratchProvider>
  );
}