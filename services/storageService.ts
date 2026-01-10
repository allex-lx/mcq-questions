import { Question } from '../types';

const STORAGE_KEY = 'quadflash_data';

// Simulates a server save operation with a delay
export const saveQuestionsToServer = async (questions: Question[]): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
        resolve(true);
      } catch (error) {
        console.error("Failed to save to storage", error);
        resolve(false);
      }
    }, 800); // Simulate network latency
  });
};

export const loadQuestionsFromServer = (): Question[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as Question[];
  } catch (error) {
    console.error("Failed to load from storage", error);
    return null;
  }
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Sample data for initial load or demo
export const SAMPLE_DATA: Question[] = [
  {
    "question": "Using horizontal view at 42 inches confirms:",
    "options": [
      "Access to sunlight",
      "Access to fresh air",
      "Access to views",
      "Access to exits"
    ],
    "answer": "Access to views"
  },
  {
    "question": "Which HTTP method is idempotent?",
    "options": [
      "POST",
      "PUT",
      "PATCH",
      "CONNECT"
    ],
    "answer": "PUT"
  },
  {
    "question": "In React, what is the default behavior of useEffect?",
    "options": [
      "Runs only on mount",
      "Runs on every render",
      "Runs only on unmount",
      "Runs when props change"
    ],
    "answer": "Runs on every render"
  },
  {
    "question": "What is the primary function of Redux?",
    "options": [
      "Routing",
      "Server-side rendering",
      "State management",
      "API calls"
    ],
    "answer": "State management"
  },
  {
    "question": "Which hook is used for performance optimization?",
    "options": [
      "useState",
      "useEffect",
      "useMemo",
      "useContext"
    ],
    "answer": "useMemo"
  }
];