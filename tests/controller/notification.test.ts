const notification = require('../../src/controller/notification');

jest.mock('../../src/model/notification');

describe('environmental variables', () => {
    test('correct greeting is generated', async () => {
        let helloRespond = await notification.createNotificationType({
            "body": JSON.stringify({
                "name": "Payment-Success",
                "dummyPayload": "{}"
            })
        });
        expect(helloRespond).toHaveProperty('statusCode');
        expect(helloRespond).toHaveProperty('body');
    });
});