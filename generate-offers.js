const express = require('express');
const { connect } = require('nats');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to NATS JetStream
let natsConnection;
let js;

(async () => {
  natsConnection = await connect({ servers: 'localhost:4222' });
  js = natsConnection.jetstream();
})();

app.get('/generate-offers', async (req, res) => {
  try {
    // Assign a random ID
    const userId = Math.floor(Math.random() * 100000000) + 1;

    // Respond to the user immediately with the ID
    res.json({ id: userId });

    // Simulate think time (1 to 2 seconds)
    const delay = Math.floor(Math.random() * 1000) + 1000; // 1000–2000 ms

    setTimeout(async () => {
      try {
        // Generate offers
        const offer1 = Math.floor(Math.random() * 10000) + 1;
        const offer2 = Math.floor(Math.random() * 10000) + 1;
        const offer3 = Math.floor(Math.random() * 10000) + 1;

        // Generate timestamp
        const generateTime = Date.now();

        // Compose payload
        const payload = {
          id: userId,
          offer1,
          offer2,
          offer3,
          'generate-time': generateTime
        };

        // Publish to NATS JetStream
        const subject = `publish-offers.${userId}`;
        await js.publish(subject, Buffer.from(JSON.stringify(payload)));

        console.log(`Published offers for ID ${userId} after ${delay}ms delay`);
      } catch (publishErr) {
        console.error('Error publishing to NATS:', publishErr);
      }
    }, delay);

  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Failed to handle request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
