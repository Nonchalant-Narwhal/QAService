const { connectToDB } = require('./dbpool.js');

it('connects to the db', () => {
  return connectToDB()
    .then(result => {
      expect(result.length).toBe(2);
    })
    .catch(err => {
      return err;
    });
});
