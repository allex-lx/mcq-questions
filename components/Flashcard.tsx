import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../types';
import { Check, X, Eye, EyeOff, HelpCircle, Star } from 'lucide-react';

interface FlashcardProps {
  data: Question;
  index: number;
  onToggleDoubt?: () => void;
  onToggleImportant?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ data, index, onToggleDoubt, onToggleImportant }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Randomize options order on mount or when data changes
  const shuffledOptions = useMemo(() => {
    const options = [...data.options];
    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [data]);

  // Reset state when data changes (but not when doubt/important changes)
  // We use data.question as key dependency to avoid resetting on flag changes
  useEffect(() => {
    setSelectedOption(null);
    setShowAnswer(false);
    setIsCorrect(null);
  }, [data.question, data.answer, data.options]); // only reset if the core content changes

  const handleOptionClick = (option: string) => {
    if (showAnswer) return; // Disable interaction if answer is shown (optional)
    
    setSelectedOption(option);
    if (option === data.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header / Question Area */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 relative">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {index + 1}</span>
          <div className="flex gap-2">
            {isCorrect === true && <span className="text-green-600 flex items-center text-sm font-medium"><Check size={16} className="mr-1"/> Correct</span>}
            {isCorrect === false && <span className="text-red-500 flex items-center text-sm font-medium"><X size={16} className="mr-1"/> Incorrect</span>}
          </div>
        </div>
        
        {/* Indicators for flags */}
        <div className="absolute top-0 right-0 p-2 flex gap-1">
          {data.isDoubt && <div className="h-2 w-2 rounded-full bg-amber-500"></div>}
          {data.isImportant && <div className="h-2 w-2 rounded-full bg-indigo-500"></div>}
        </div>

        <h3 className="text-lg font-semibold text-slate-800 leading-snug pr-4">{data.question}</h3>
      </div>

      {/* Content Area - Options */}
      <div className="p-5">
        <div className="space-y-3">
          {shuffledOptions.map((option, idx) => {
            let itemClass = "w-full text-left p-3 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-between group ";
            
            if (selectedOption === option) {
              if (option === data.answer) {
                itemClass += "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
              } else {
                itemClass += "bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500";
              }
            } else if (showAnswer && option === data.answer) {
              itemClass += "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
            } else {
              itemClass += "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={itemClass}
              >
                <span>{option}</span>
                {selectedOption === option && option === data.answer && <Check size={18} className="text-green-600" />}
                {selectedOption === option && option !== data.answer && <X size={18} className="text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
        
        {/* Toggle Buttons Group */}
        <div className="flex gap-2">
           <button 
             onClick={onToggleDoubt}
             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
               data.isDoubt 
               ? 'bg-amber-100 text-amber-700 border-amber-200' 
               : 'bg-white text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-600'
             }`}
             title="Mark as Doubt"
           >
             <HelpCircle size={16} className={data.isDoubt ? "fill-amber-500 text-amber-500 mr-1.5" : "mr-1.5"} />
             Doubt
           </button>

           <button 
             onClick={onToggleImportant}
             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
               data.isImportant 
               ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
               : 'bg-white text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
             }`}
             title="Mark as Important"
           >
             <Star size={16} className={data.isImportant ? "fill-indigo-500 text-indigo-500 mr-1.5" : "mr-1.5"} />
             Important
           </button>
        </div>

        {/* Show Answer Button */}
        <button
          onClick={toggleAnswer}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto ${
            showAnswer 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {showAnswer ? (
            <>
              <EyeOff size={16} className="mr-2" />
              Hide
            </>
          ) : (
            <>
              <Eye size={16} className="mr-2" />
              Answer
            </>
          )}
        </button>
      </div>
      
      {/* Revealed Answer Panel */}
      {showAnswer && (
        <div className="bg-blue-50 px-4 py-3 border-t border-blue-100 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">Answer</p>
          <p className="text-blue-900 font-medium">{data.answer}</p>
        </div>
      )}
    </div>
  );
};

export default Flashcard;