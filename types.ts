export interface Question {
  question: string;
  options: string[];
  answer: string;
  isDoubt?: boolean;
  isImportant?: boolean;
}

export interface FlashcardSet {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
}