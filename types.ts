export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
}
