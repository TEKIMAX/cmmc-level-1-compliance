import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.OLLAMA_API_PORT || 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Ollama API Proxy' });
});

// Get Ollama models
app.get('/api/ollama/models', async (req, res) => {
  const ollamaEndpoint = req.query.endpoint || 'http://localhost:11434';
  
  try {
    console.log(`Fetching models from ${ollamaEndpoint}/api/tags`);
    
    const response = await fetch(`${ollamaEndpoint}/api/tags`);
    
    if (!response.ok) {
      console.error(`Ollama API responded with status ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({
        error: `Failed to fetch models: ${response.status} ${response.statusText}`
      });
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.models?.length || 0} models from Ollama`);
    
    // Validate the response structure
    if (!data.models || !Array.isArray(data.models)) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({
        error: 'Invalid response from Ollama API'
      });
    }
    
    res.json({ models: data.models });
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Provide specific error messages
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Connection refused')) {
      errorMessage = 'Cannot connect to Ollama. Make sure Ollama is running on the specified endpoint.';
    } else if (errorMessage.includes('fetch')) {
      errorMessage = 'Network error connecting to Ollama. Check if the endpoint is correct and accessible.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Chat completion proxy for Ollama
app.post('/api/ollama/chat', async (req, res) => {
  const { ollamaEndpoint, model, messages, maxTokens, temperature } = req.body;
  const endpoint = ollamaEndpoint || 'http://localhost:11434';
  
  try {
    const requestBody = {
      model: model,
      messages: messages,
      stream: false,
      options: {
        num_predict: maxTokens || 500,
        temperature: temperature || 0.7,
      }
    };
    
    console.log(`Sending chat request to ${endpoint}/api/chat`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`Ollama chat API responded with status ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({
        error: `Failed to get chat response: ${response.status} ${response.statusText}`
      });
    }
    
    const data = await response.json();
    console.log('Successfully got chat response from Ollama');
    
    res.json({ 
      content: data.message?.content || 'No response generated',
      model: data.model,
      created_at: data.created_at
    });
  } catch (error) {
    console.error('Error in Ollama chat:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Embeddings proxy for Ollama (using correct Ollama API)
app.post('/api/ollama/embeddings', async (req, res) => {
  const { ollamaEndpoint, model, prompt } = req.body;
  const endpoint = ollamaEndpoint || 'http://localhost:11434';
  
  try {
    console.log(`Generating embeddings using ${endpoint}/api/embed with model: ${model}`);
    
    const response = await fetch(`${endpoint}/api/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'mxbai-embed-large:latest',
        input: prompt  // Changed from 'prompt' to 'input' to match Ollama API
      })
    });
    
    if (!response.ok) {
      console.error(`Ollama embeddings API responded with status ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({
        error: `Failed to generate embeddings: ${response.status} ${response.statusText}`
      });
    }
    
    const data = await response.json();
    console.log(`Successfully generated embeddings (${data.embeddings?.[0]?.length || 0} dimensions)`);
    
    res.json({ 
      embedding: data.embeddings?.[0] || [],  // Ollama returns embeddings array, we take first one
      model: data.model
    });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Listen with better error handling
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Ollama API proxy server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
  return server;
};

startServer(PORT); 