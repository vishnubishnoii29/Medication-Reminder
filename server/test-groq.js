require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testGroqAPI() {
  console.log('🧪 Testing Groq API Connection...\n');
  
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not set in .env file');
    process.exit(1);
  }

  console.log('✅ API Key found:', process.env.GROQ_API_KEY.substring(0, 10) + '...\n');

  // List of models to try
  const modelsToTry = [
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'gemma-7b-it',
    'mixtral-8x7b-32768'
  ];

  console.log('Testing models:\n');

  for (const model of modelsToTry) {
    try {
      console.log(`⏳ Testing ${model}...`);
      
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a health expert. Respond concisely.'
          },
          {
            role: 'user',
            content: 'What is medication adherence?'
          }
        ],
        model: model,
        max_tokens: 100,
        temperature: 0.7
      });

      console.log(`✅ SUCCESS with ${model}`);
      console.log(`   Response: ${response.choices[0].message.content.substring(0, 80)}...`);
      console.log(`   Tokens: ${response.usage.prompt_tokens + response.usage.completion_tokens}\n`);
      
      console.log(`\n🎉 RECOMMENDED MODEL: ${model}`);
      console.log('\nUpdate aiService.js line with:');
      console.log(`  model: '${model}',`);
      
      process.exit(0);
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }

  console.error('❌ All models failed. Check your API key or Groq account status.');
  process.exit(1);
}

testGroqAPI();
