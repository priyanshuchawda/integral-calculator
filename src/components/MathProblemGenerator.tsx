import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './MathProblemGenerator.css';

interface MathProblemGeneratorProps {
  theme: 'light' | 'dark';
}

interface Problem {
  question: string;
  answer: number;
  steps: string[];
}

const MathProblemGenerator: React.FC<MathProblemGeneratorProps> = ({ theme }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);

  const generateProblem = () => {
    let newProblem: Problem;
    switch (difficulty) {
      case 'easy':
        newProblem = generateEasyProblem();
        break;
      case 'medium':
        newProblem = generateMediumProblem();
        break;
      case 'hard':
        newProblem = generateHardProblem();
        break;
      default:
        newProblem = generateEasyProblem();
    }
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback('');
    setShowSolution(false);
  };

  const generateEasyProblem = (): Problem => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    const question = `${a} ${operation} ${b}`;
    const answer = evaluate(question);
    const steps = [`${question} = ${answer}`];
    return { question, answer, steps };
  };

  const generateMediumProblem = (): Problem => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const op1 = operations[Math.floor(Math.random() * 3)];
    const op2 = operations[Math.floor(Math.random() * 3)];
    const question = `${a} ${op1} ${b} ${op2} ${c}`;
    const answer = evaluate(question);
    const steps = [
      `First, let's handle the multiplication (if any):`,
      op1 === '*' ? `${a} * ${b} = ${a * b}` : (op2 === '*' ? `${b} * ${c} = ${b * c}` : 'No multiplication in this problem.'),
      `Then, we can solve the problem from left to right:`,
      `${question} = ${answer}`
    ];
    return { question, answer, steps };
  };

  const generateHardProblem = (): Problem => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const question = `${a}x^2 + ${b}x + ${c} = 0`;
    const discriminant = b * b - 4 * a * c;
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const steps = [
      `To solve ${question}, we use the quadratic formula: x = (-b ± √(b^2 - 4ac)) / (2a)`,
      `a = ${a}, b = ${b}, c = ${c}`,
      `Discriminant = b^2 - 4ac = ${b}^2 - 4(${a})(${c}) = ${discriminant}`,
      `x1 = (-${b} + √${discriminant}) / (2(${a})) = ${x1.toFixed(2)}`,
      `x2 = (-${b} - √${discriminant}) / (2(${a})) = ${x2.toFixed(2)}`,
    ];
    return { question, answer: x1, steps };
  };

  const checkAnswer = () => {
    if (!problem) return;
    const userAnswerNum = parseFloat(userAnswer);
    if (isNaN(userAnswerNum)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    const isCorrect = Math.abs(userAnswerNum - problem.answer) < 0.01;
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect. Try again or check the solution.');
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <div className={`math-problem-generator ${theme}`}>
      <h2>Math Problem Generator</h2>
      <div className="problem-container">
        <div className="problem">
          <h3>Problem:</h3>
          <p>{problem?.question}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          <button onClick={checkAnswer}>Check Answer</button>
          <button onClick={generateProblem}>Generate New Problem</button>
          <button onClick={() => setShowSolution(!showSolution)}>
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          <div className="solution" style={{ display: showSolution ? 'block' : 'none' }}>
            <h3>Solution:</h3>
            <ul>
              {problem?.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="score">
          <h3>Score:</h3>
          <p>{score}</p>
        </div>
      </div>
    </div>
  );
};

export default MathProblemGenerator;