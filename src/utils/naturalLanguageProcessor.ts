import nlp from 'compromise';

export const processInput = (input: string) => {
  const doc = nlp(input);
  
  if (doc.has('solve')) {
    return { type: 'equation', equation: doc.match('solve #Noun+').text() };
  }
  
  if (doc.has('plot')) {
    return { type: 'plot', function: doc.match('plot #Noun+').text() };
  }
  
  if (doc.has('integrate')) {
    return { type: 'integration', function: doc.match('integrate #Noun+').text() };
  }
  
  return { type: 'unknown', original: input };
};