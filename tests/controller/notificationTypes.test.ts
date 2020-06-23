const notificationType = require('../../src/controller/notificationType');

jest.mock('../../src/model/notificationType');

describe('Controller/NotificationType', () => {
    test('createNotificationType() Should contain body and statusCode', async () => {
        let respond = await notificationType.createNotificationType({
            "body": JSON.stringify({
                "name": "Payment-Success",
                "dummyPayload": "{}"
            })
        });
        expect(respond).toHaveProperty('statusCode');
        expect(respond).toHaveProperty('body');
    });
    
    test('getNotificationTypes() Should contain body and statusCode', async () => {
        let respond = await notificationType.getNotificationTypes();
        expect(respond).toHaveProperty('statusCode');
        expect(respond).toHaveProperty('body');
    });
});