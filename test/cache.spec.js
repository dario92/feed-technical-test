import 'babel-polyfill';
import lowdb from 'lowdb';
import mock from 'mock-fs';
import testDBJson from './db.test.json';
import { get, set, __RewireAPI__ as rewireAPI } from '../src/cache';
import { assert } from 'chai';

describe('Cache module', () => {
  before(() => {
    const dbPath = rewireAPI.__get__('dbPath');
    mock({ [dbPath]: JSON.stringify(testDBJson) });
    rewireAPI.__set__('db', lowdb(dbPath));
  });
  after(() => mock.restore());

  describe('#get', () => {
    it('should return undefined when id is not set', () => assert.deepEqual(get(), undefined));
    it('should return undefined when id is not an integer', () => {
      assert.deepEqual(get('ID'), undefined);
    });

    it('should return undefined when id is not found in database', () => {
      assert.deepEqual(get(2), undefined);
    });

    it('should return correct item from cache', () => {
      const item = testDBJson.cache[0];
      item.date = new Date(item.date);
      assert.deepEqual(get(1), item);
    });

    it('item.date should be a date', () => {
      const item = testDBJson.cache[0];
      item.date = new Date(item.date);

      const { date } = get(1);

      assert.instanceOf(date, Date);
      assert.deepEqual(item.date, date);
    });
  });

  describe('#set', () => {
    it('should return false when id is not set', () => assert.deepEqual(set(), false));
    it('should return false when id is not an integer', () => {
      assert.deepEqual(set('ID'), false);
    });

    it('should add new iteam to databse', () => {
      const id = 2;
      const value = 'TEST_VALUE';

      assert.deepEqual(set(id, value), true);

      const item = get(id);
      assert.deepEqual(item.id, id);
      assert.deepEqual(item.value, value);
    });

    it('should update item value and date', () => {
      const id = 1;
      const value = 'UPDATED_VALUE';
      const item = get(id);

      assert.deepEqual(item, testDBJson.cache[0]);
      assert.deepEqual(set(id, value), true);

      const updatedItem = get(id);

      assert.deepEqual(updatedItem.id, id);
      assert.deepEqual(updatedItem.value, value);
      assert(item.date < updatedItem.date);
    });
  });
});
