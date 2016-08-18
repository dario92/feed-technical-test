import lowdb from 'lowdb';
import { join } from 'path';

const dbPath = join(process.cwd(), './db.local.json');
const db = lowdb(dbPath);

/**
 * @name get
 * @desc Get an elemet from the cache database
 * @param {String} id - Id of the item that needs to be fetched. If iteam is not in databse then
 * `undefined` will be returned.
 * @param {Object} - Return a cache item object
 * E.g.
 * {
 *    id: 10
 *    value: '...'
 *    date: Thu Aug 18 2016 02:03:02 GMT+0100 (BST)
 * }
 */
export function get(id) {
  const item = db.get('cache').find({ id }).value();

  if (item && item.date) {
    item.date = new Date(item.date);
  }

  return item;
}

/**
 * @name set
 * @desc Insert/update and element in the cache. The date field of the item will be updated.
 * @param {String} id - Id of item
 * @param {Mixed} value - New value
 * @return {void}
 */
export function set(id, value) {
  const data = { id, value, date: new Date() };
  const cache = db.get('cache').value() || [];
  db.set('cache', [data, ...(cache.filter((item) => item.id !== id))]).value();
}
