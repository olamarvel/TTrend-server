// Import the OpenAI library
// const { Configuration, OpenAIApi } = require("openai");
import OpenAI from 'openai';
import http from "http"
// // Set the OpenAI API key as an environment variable
// const configuration = new Configuration({
//   apiKey: "process.env.OPENAI_API_KEY",
// });

// Create an OpenAI API client
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});


// Import the http module
// const http = require("http");

// Set the server port
const SERVER_PORT = 8184;

// Create a http server
const server = http.createServer();

// Listen to the server port
server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}. Hit Ctrl-C to end.`);
});

// Handle requests
server.on("request", async (req, res) => {
  switch (req.url) {
    case "/api":
      // Set the response header to JSON
      res.setHeader("Content-Type", "application/json");

      // Check if the request is valid JSON
      if (
        (req.headers["content-type"] || "").replace(/\s*;.*$/, "") !==
        "application/json"
      ) {
        // Send an error response
        res.writeHead(400);
        res.end(JSON.stringify({ error: "invalid json" }));
        break;
      }

      // Read the request body
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }

      let json;
      try {
        // Parse the request body as JSON
        json = JSON.parse(Buffer.concat(buffers).toString());
      } catch {
        // Send an error response
        res.writeHead(400);
        res.end(JSON.stringify({ error: "invalid json" }));
        break;
      }

      // Generate a response using the OpenAI API
      const result = await generateResponse(json.prompt);

      // Send a success response
      res.writeHead(200);
      res.end(JSON.stringify({ response: result }));
      break;
    default:
      // Send a not found response
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.writeHead(404);
      res.end("404 Not Found");
      break;
  }
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
console.log(response)
  // Return the generated text
  return response?.choices[0]?.text || "empty ";
};
