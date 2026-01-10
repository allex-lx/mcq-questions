import React, { useState } from 'react';
import { Question } from '../types';
import { Upload, FileJson, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { SAMPLE_DATA } from '../services/storageService';

interface DataInputProps {
  onDataLoaded: (data: Question[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onDataLoaded }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndLoad = (data: any) => {
    if (!Array.isArray(data)) {
      // It might be a single object, let's try to wrap it
      if (typeof data === 'object' && data.question && data.options && data.answer) {
         onDataLoaded([data]);
         return;
      }
      setError("JSON must be an array of questions or a single question object.");
      return;
    }

    const isValid = data.every(item => 
      item.hasOwnProperty('question') && 
      Array.isArray(item.options) && 
      item.hasOwnProperty('answer')
    );

    if (!isValid) {
      setError("Invalid format. Each item must have 'question', 'options' (array), and 'answer'.");
      return;
    }

    onDataLoaded(data);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };

  const handlePasteLoad = () => {
    try {
      if (!jsonText.trim()) {
        setError("Please enter some JSON data first.");
        return;
      }
      const parsed = JSON.parse(jsonText);
      validateAndLoad(parsed);
    } catch (e) {
      setError("Invalid JSON syntax. Please check your text.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        validateAndLoad(parsed);
      } catch (e) {
        setError("Error parsing file. Ensure it is a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    onDataLoaded(SAMPLE_DATA);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FileJson className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Connect Data Source</h2>
        <p className="text-slate-500 mt-2">Upload a JSON file or paste your question data below to get started.</p>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                 try {
                   const parsed = JSON.parse(ev.target?.result as string);
                   validateAndLoad(parsed);
                 } catch(err) { setError("Invalid JSON file"); }
              };
              reader.readAsText(file);
            }
          }}
        >
          <input 
            type="file" 
            id="fileInput" 
            accept=".json" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
            <Upload className="text-slate-400 mb-3" size={32} />
            <span className="text-slate-700 font-medium">Click to upload JSON file</span>
            <span className="text-slate-400 text-sm mt-1">or drag and drop here</span>
          </label>
        </div>

        <div className="flex items-center justify-center">
          <span className="h-px bg-slate-200 w-full"></span>
          <span className="px-4 text-slate-400 text-sm uppercase font-semibold tracking-wider">OR</span>
          <span className="h-px bg-slate-200 w-full"></span>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Paste JSON Data</label>
          <textarea
            className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder='[ { "question": "...", "options": [...], "answer": "..." } ]'
            value={jsonText}
            onChange={handleTextChange}
          ></textarea>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start text-sm">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4">
            <button
            onClick={loadSample}
            className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors flex items-center justify-center"
            >
            <Play size={18} className="mr-2" />
            Use Sample Data
            </button>
            <button
            onClick={handlePasteLoad}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center justify-center"
            >
            <CheckCircle size={18} className="mr-2" />
            Load Data
            </button>
        </div>
      </div>
    </div>
  );
};

export default DataInput;