
import React from 'react';
import Header from '@/components/layout/Header';
import HistoryPage from '@/components/history/HistoryPage';

const History = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HistoryPage />
      </main>
    </div>
  );
};

export default History;
