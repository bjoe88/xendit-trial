const handler = require('../handler');

test('correct greeting is generated', async () => {
    let helloRespond = await handler.hello("event");
    expect(helloRespond).toHaveProperty('statusCode');
    expect(helloRespond).toHaveProperty('body');
});