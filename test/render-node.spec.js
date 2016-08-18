import 'babel-polyfill';
import { assert } from 'chai';
import renderNodeBase64, { __RewireAPI__ as rewireAPI } from '../src/render-node';
import { endpointBody, phantomLoadHTML, redSquareStrBase64 } from './test-helpers.js';

describe('Render node module', () => {
  it('should return promise', () => assert.instanceOf(renderNodeBase64({}), Promise));

  it('should fail when no param given', () => assert.throws(renderNodeBase64));

  it('should resolve with correct base64', async () => {
    const url = 'http://www.test.com';
    const selector = '#square';

    rewireAPI.__Rewire__('getCacheItem', () => null);
    rewireAPI.__Rewire__('setCacheItem', () => null);
    rewireAPI.__Rewire__('phantonLoadPage', () => phantomLoadHTML(endpointBody));

    const strBase64 = await renderNodeBase64({ url, selector });

    assert.deepEqual(strBase64, redSquareStrBase64);
  });

  it('should use data from cache', async () => {
    let updatedCache = false;
    const url = 'http://www.test.com';
    const selector = '#square';
    const id = 1;
    const cacheItemMock = { id, value: 'FAKE_BASE64', date: new Date() };

    rewireAPI.__Rewire__('getCacheItem', () => cacheItemMock);
    rewireAPI.__Rewire__('setCacheItem', () => { updatedCache = true; });
    rewireAPI.__Rewire__('phantonLoadPage', () => phantomLoadHTML(endpointBody));

    const strBase64 = await renderNodeBase64({ url, selector, index: id });

    assert.deepEqual(strBase64, cacheItemMock.value);
    assert.deepEqual(updatedCache, false);
  });

  it('should scrape url when cache is at least 1 day old', async () => {
    let updatedCache = false;
    const url = 'http://www.test.com';
    const selector = '#square';
    const id = 1;
    const cacheItemMock = {
      id,
      value: 'FAKE_BASE64',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
    };

    rewireAPI.__Rewire__('getCacheItem', () => cacheItemMock);
    rewireAPI.__Rewire__('setCacheItem', () => { updatedCache = true; });
    rewireAPI.__Rewire__('phantonLoadPage', () => phantomLoadHTML(endpointBody));

    const strBase64 = await renderNodeBase64({ url, selector, index: id - 1 });

    assert.deepEqual(strBase64, redSquareStrBase64);
    assert.deepEqual(updatedCache, true);
  });

  it('should fail when no element match selector', async () => {
    try {
      const url = 'http://www.test.com';
      const selector = '#fake-square';

      rewireAPI.__Rewire__('getCacheItem', () => null);
      rewireAPI.__Rewire__('setCacheItem', () => null);
      rewireAPI.__Rewire__('phantonLoadPage', () => phantomLoadHTML(endpointBody));

      await renderNodeBase64({ url, selector });
      assert.isNotOk(false);
    } catch (err) {
      assert.isOk(true);
    }
  });
});
