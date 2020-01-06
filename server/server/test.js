const { connectToDB } = require('./models.js');
const router = require('./router.js');

it('connects to the db', () => {
  return connectToDB()
    .then(result => {
      expect(result.length).toEqual(2);
    })
    .catch(err => {
      return err;
    });
});
