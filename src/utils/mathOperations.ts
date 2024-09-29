import { create, all } from 'mathjs';

const math = create(all);

export const calculateResult = async (input: string) => {
  try {
    const result = math.evaluate(input);
    let plot = null;

    if (input.toLowerCase().includes('plot')) {
      // Generate plot data
      plot = generatePlot(input);
    }

    return {
      result: {
        type: 'latex',
        value: math.parse(result.toString()).toTex()
      },
      plot
    };
  } catch (error) {
    return {
      result: {
        type: 'error',
        value: (error as Error).message
      },
      plot: null
    };
  }
};

const generatePlot = (input: string) => {
  // Implement plot generation logic here
  // This is a placeholder and should be replaced with actual plotting logic
  return {
    data: [
      {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
      }
    ],
    layout: {
      title: 'Sample Plot'
    }
  };
};