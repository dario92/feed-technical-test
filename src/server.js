import 'babel-polyfill';
import express from 'express';
import renderNodeBase64 from './render-node';

const app = express();

app.get('/collections/:id', async (req, res) => {
  const { id } = req.params;
  const url = 'http://www.ebay.co.uk/today';
  const selector = '.hero-container .big-heros .big-hero.no-lazy';
  const mimeType = 'image/png';

  try {
    // get the node's image base64
    const strBase64 = await renderNodeBase64({ url, selector, index: id - 1 });

    // Create a image buffer and render to user
    const img = new Buffer(strBase64, 'base64');

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': img.length,
    });

    res.end(img);
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
});

app.listen(3000, () => {
  process.stdout.write('Server is running at http://localhost:3000\n');
});
