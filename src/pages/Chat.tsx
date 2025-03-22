
import React from 'react';
import Header from '@/components/layout/Header';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Chat;
