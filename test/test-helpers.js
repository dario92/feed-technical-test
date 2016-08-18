import { phantomSuccessStatus } from '../src/config';
import phantom from 'phantom';

export const endpointBody = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <div id="square" style="width: 100px; height: 100px; background-color: red;"></div>
  </body>
</html>
`;

export function phantomLoadHTML(html) {
  return new Promise(async (resolve, reject) => {
    try {
      const ph = await phantom.create();
      const page = await ph.createPage();
      const status = phantomSuccessStatus;

      await page.property('content', html);
      resolve({ ph, page, status });
    } catch (err) {
      reject(err);
    }
  });
}

// eslint-disable-next-line max-len
export const redSquareStrBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABAElEQVR4nO3RQQ0AIBDAsAP/nuGNAvZoFSzZOjNnyNi/A3gZEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIjCExhsQYEmNIzAXsTALGT7m3PwAAAABJRU5ErkJggg==';
