import 'babel-polyfill';

describe('Cache module', () => {
  describe('#get', () => {
    it('should return undefined when id is not set');
    it('should return undefined when id is not an integer');
    it('should return undefined when id is not found in database');
    it('should return correct item from cache');
    it('item.date should be a date');
  });

  describe('#set', () => {
    it('should return false when id is not set');
    it('should return false when id is not an integer');
    it('should add new iteam to databse');
    it('should update item value');
    it('should update item.date');
  });
});
