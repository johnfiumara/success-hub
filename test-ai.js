const { generateAIAdvice } = require('./src/actions/aiGuide');

generateAIAdvice("Hello").then(console.log).catch(console.error);
