// Import the OpenAI library
import OpenAI from 'openai';

// Import the express module
import express from 'express';

// Create an express app
const app = express();

// Set the OpenAI API key as an environment variable
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

// Set the server port
const SERVER_PORT = 8184;

// Use the express.json middleware to parse JSON requests
app.use(express.json());

// Handle GET requests to the root path
app.get('/', (req, res) => {
  res.send('Welcome to the express server.');
});

// Handle POST requests to the /api path
app.post('/api', async (req, res) => {
  // Get the prompt from the request body
  const { prompt } = req.body;

  // Generate a response using the OpenAI API
  const result = await generateResponse(prompt);

  // Send a success response with the result
  res.json({ response: result });
});

// Define a function to generate a response using the OpenAI API
const generateResponse = async (message) => {
  // Define the prompt for the OpenAI API
  const prompt = `Given trends, tweet about one. Be short, sensible, and creative.

  Example: Trends: wicked, science, javascript, puppy Posts: Did you know puppies are the most lovable animal on earth?

Now you try:
Trends: ${message}
Posts:`;

  // Define the parameters for the OpenAI API
  const params = {
    model: "gpt-3.5-turbo-instruct",
    max_tokens: 32,
    temperature: 0.9,
    stop: "\n",
  };

  // Call the OpenAI API
  const response = await openai.completions.create({
    prompt,
    ...params,
  });
  console.log(response);

  // Return the generated text
  return response?.choices[0]?.text || "empty ";
};

// Start the server and listen to the port
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}. Hit Ctrl-C to end.`);
});
