const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/analyze', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Face style backend running on port ${PORT}`);
});
