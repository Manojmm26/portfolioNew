export interface ProgrammingQuestion {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  methodology: {
    approach: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  solutions: Array<{
    approach: string;
    code: string;
    explanation: string;
  }>;
}
