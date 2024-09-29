import axios from 'axios';

const mathKeywords = ['add', 'subtract', 'multiply', 'divide', 'calculate', 'solve', 'equation', 'integral', 'derivative', 'graph'];

const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  if (mathKeywords.some(keyword => lowercaseInput.includes(keyword))) {
    return `To ${lowercaseInput}, you can follow these steps:\n1. Identify the mathematical operation involved.\n2. Apply the relevant formula or method.\n3. Perform the calculations step by step.\n4. Verify your answer by checking units and reasonableness.`;
  }
  
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
    return "Hello! I'm your math assistant. How can I help you with your calculations today?";
  }
  
  if (lowercaseInput.includes('thank')) {
    return "You're welcome! If you have any more questions about math, feel free to ask.";
  }
  
  return "I'm sorry, I didn't understand your question. Could you please rephrase it or ask about a specific math topic?";
};

export const getAIResponse = async (prompt: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return generateResponse(prompt);
};
