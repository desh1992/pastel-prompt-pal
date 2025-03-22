
import React from 'react';
import Header from '@/components/layout/Header';
import TextEditor from '@/components/editor/TextEditor';

const Editor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TextEditor />
      </main>
    </div>
  );
};

export default Editor;
