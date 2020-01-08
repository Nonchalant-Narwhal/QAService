const { connectToDB, pgquery } = require('./models.js');
const { router } = require('./router.js');
const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);
// let router = require('./router.js');

it('connects to the db', () => {
  return connectToDB()
    .then(result => {
      expect(result.length).toEqual(2);
    })
    .catch(err => {
      return err;
    });
});

describe('GET /qa/:product_id', () => {
  it('has a statuscode of 200', async done => {
    const res = await request.get('/qa/7');
    expect(res.status).toBe(200);
    done();
  });
  it("errors out when sending requests that don't have numbers", async done => {
    const res = await request.get('/qa/asidj');
    expect(res.status).toBe(400);
    done();
  });
  it('has the right properties in the response', async done => {
    const res = await request.get('/qa/3');
    console.log('RES', res);
    expect(res.body.product_id).toBe('3');
    // console.log(res.results);
    expect(Array.isArray(res.body.results)).toEqual(true);
    expect(res.body.results[0].question_id).toEqual('16');
    expect(res.body.results[0].question_body).toEqual('How long does it last?');
    expect(res.body.results[0].question_date).toEqual('2018-08-24');
    expect(res.body.results[0].asker_name).toEqual('funnygirl');
    expect(res.body.results[0].question_helpfulness).toEqual('0');
    expect(res.body.results[0].reported).toEqual(0);
    expect(typeof res.body.results[0].answers).toEqual('object');
    expect(res.body.results[1].answers['18'].id).toBe('18');
    expect(res.body.results[1].answers['18'].body).toEqual(
      "Runs small, I'd say"
    );
    expect(res.body.results[1].answers['18'].date).toEqual('2018-01-12');
    expect(res.body.results[1].answers['18'].answerer_name).toEqual('warmkid');
    expect(res.body.results[1].answers['18'].helpfulness).toEqual(9);
    expect(Array.isArray(res.body.results[1].answers['18'].photos)).toEqual(
      true
    );
    done();
  });
});

/*
    .post('/api/posts')
    .send({
      userId: 1,
      title: 'test is cool',
    })
  expect(res.statusCode).toEqual(201)
  expect(res.body).toHaveProperty('post')
  */
