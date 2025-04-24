const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/order', (req, res) => {
  const order = req.body;
  const log = `[${new Date().toISOString()}] Order: ${JSON.stringify(order)}\n`;

  fs.appendFile('orders.txt', log, err => {
    if (err) {
      console.error('❌ Error saving order:', err);
      return res.status(500).send('Server error');
    }
    console.log('✅ Order saved:', order);
    res.status(200).json({ message: 'Order saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});