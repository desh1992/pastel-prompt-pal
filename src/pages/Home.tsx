
import React from 'react';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/home/Dashboard';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Home;
