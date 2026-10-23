
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
const port = 3000;

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'data');

app.use(express.static(path.join(projectRoot, 'public')));

app.get('/api/summary', (_req, res) => {
  const filePath = path.join(dataDir, 'summary.json');

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'No test summary found' });
    return;
  }

  res.json(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
});

app.get('/api/history', (_req, res) => {
  const filePath = path.join(dataDir, 'history.json');

  if (!fs.existsSync(filePath)) {
    res.json([]);
    return;
  }

  res.json(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
});

app.listen(port, () => {
  console.log(`FlakeGuard dashboard running at http://localhost:${port}`);
});
