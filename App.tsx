import React, { useState, useEffect } from 'react';
import { Question } from './types';
import Flashcard from './components/Flashcard';
import DataInput from './components/DataInput';
import { saveQuestionsToServer, loadQuestionsFromServer, clearData } from './services/storageService';
import { RotateCcw, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [viewMode, setViewMode] = useState<'input' | 'practice'>('input');
  const [isSaving, setIsSaving] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const savedData = loadQuestionsFromServer();
    if (savedData && savedData.length > 0) {
      setQuestions(savedData);
      setViewMode('practice');
    }
  }, []);

  const handleDataLoaded = async (data: Question[]) => {
    setIsSaving(true);
    // Simulate server upload
    await saveQuestionsToServer(data);
    setIsSaving(false);
    setQuestions(data);
    setViewMode('practice');
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear current data and upload new file?")) {
      clearData();
      setQuestions([]);
      setViewMode('input');
    }
  };

  if (viewMode === 'input') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-center text-slate-900 mb-2 tracking-tight">QuadFlash</h1>
            <p className="text-center text-slate-500 mb-10">Master your subjects with our scrolling flashcard system.</p>
            {isSaving ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-slate-700">Saving data to server...</p>
              </div>
            ) : (
              <DataInput onDataLoaded={handleDataLoaded} />
            )}
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex-shrink-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
              <ScrollText className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">QuadFlash</h1>
            <span className="ml-0 md:ml-4 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
              {questions.length} Questions
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Upload New File"
            >
              <RotateCcw size={18} className="mr-2" />
              <span className="hidden sm:inline">Reset / Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable List */}
      <main className="flex-grow p-4 md:p-6 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto w-full pb-20 space-y-8">
            {questions.map((q, idx) => (
              <div key={idx} className="transition-all duration-500 ease-in-out">
                <Flashcard 
                  data={q} 
                  index={idx} 
                />
              </div>
            ))}
            
            {/* End of list marker */}
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-200/50 text-slate-400">
                <span className="text-sm font-medium px-4">End of Questions</span>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;