import phantom from 'phantom';
import { phantomSuccessStatus } from './config';
import {
  get as getCacheItem,
  set as setCacheItem,
} from './cache';

/**
 * @name isCacheUpdated
 * @desc Takes in input a cache item and returns true if the item is up to date
 * @param {Object} iteam - cache iteam object
 * @return {Boolean} - Returns true if item was update today
 */
function isCacheUpdated(item) {
  const dayMilliseconds = 1000 * 60 * 60 * 24;
  const daysDiff = (
    (new Date().setHours(0, 0, 0, 0) - item.date.setHours(0, 0, 0, 0)) / dayMilliseconds
  );

  return daysDiff === 0;
}

/**
 * @name evaluateClipRectOptions
 * @desc This function is evaluated within the phantom page context.
 * @param {String} s - Node css selector. This param is required
 * @param {Integer} i - Index of node. This param is optional, default value is 0;
 * @return {Object} - Returns an object that rapresent the position in pixel of the node that
 * needs to be rendered.
 * E.g.
 * {
 *  height: 500
 *  width: 400
 *  top: 1500
 *  left: 10
 * }
 */

function evaluateClipRectOptions(s, i = 0) {
  let obj;
  let el = document.querySelectorAll(s)[i || 0];

  // console.log('document.querySelectorAll(s)', i);

  if (el) {
    const rect = el.getBoundingClientRect();

    obj = {
      height: el.offsetHeight,
      width: el.offsetWidth,
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  }
  return obj;
}

/**
 * @name phantonLoadPage
 * @desc Create browser window at given location
 * @param {String} url - URL of the location that needs to be opened
 * @return {Promise} - The promise is resolved with an object and with the following structure:
 * {
 *  ph: phantom instance
 *  page: page instace
 *  status: page loading status, can be "error" or "success"
 * }
 */
function phantonLoadPage(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const ph = await phantom.create();
      const page = await ph.createPage();
      const status = await page.open(url);

      resolve({ ph, page, status });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @desc Given a page url and a selector the method will return base64 of image of rendered element.
 * A elemnt index can also be passed optionally. For performance result is cache and cache is
 * updated daily.
 * @param {Object} options - The object must at least contain `url` and `selector` properties.
 * @return {Promise} - Promise is resolved with based64 of element's image
 */
export default ({ url, selector, index }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strBase64;
      const item = getCacheItem(index);

      // Use cache if set and if not too old
      if (item && item.value && isCacheUpdated(item)) {
        strBase64 = item.value;
      } else if (url && selector) {
        const { ph, page, status } = await phantonLoadPage(url);

        // If a network error happens while loading the requested url the throw and error
        if (status !== phantomSuccessStatus) {
          throw new Error('Unable to load the page');
        }

        // page.on('onConsoleMessage', msg => console.log(msg));

        const clipRectOptions = await page.evaluate(evaluateClipRectOptions, selector, index);

        if (!clipRectOptions) {
          throw new Error('Unable to find element.');
        }

        page.property('clipRect', clipRectOptions);
        strBase64 = await page.invokeMethod('renderBase64', 'PNG');

        // close phantom browser window
        ph.exit();

        // Insert/update cache
        setCacheItem(index, strBase64);
      } else {
        throw new Error('Invalid parameters');
      }

      resolve(strBase64);
    } catch (err) {
      reject(err);
    }
  });
};
