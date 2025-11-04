import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.text({ type: ['text/plain', 'text/markdown'] }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    author: 'Punya Pratishtha Kalia',
    githubUrl: 'https://github.com/Punya12-34/fragments',
    version: '0.0.1'
  });
});

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Version route
app.get('/v1/fragments/version', (req, res) => {
  try {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
    res.status(200).json({
      status: 'ok',
      version: pkg.version,
      name: pkg.name
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Fragments service running on http://localhost:${PORT}`);
});
