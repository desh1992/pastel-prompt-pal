
import React from 'react';
import Header from '@/components/layout/Header';
import TextAnalysisTool from '@/components/analysis/TextAnalysisTool';

const Analysis = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TextAnalysisTool />
      </main>
    </div>
  );
};

export default Analysis;
