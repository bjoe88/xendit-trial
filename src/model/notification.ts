
import uuid = require('uuid');
import AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
export interface Notfication {
    pk: string
    sk: string
    name: string
    dummyPayload: string
}

export interface NotficationDisplay {
    id: string
    name: string
    dummyPayload: string
}

export async function createNotification(name: string, dummyPayload: string) {
    const notification = notificationData(name, dummyPayload);
    const notificationInfo = {
        TableName: "notification-table",
        Item: notification,
    };
    return dynamoDb.put(notificationInfo).promise()
        .then(res => toDisplay(notification));
};

const notificationData = (name: string, dummyPayload: string): Notfication => {
    const timestamp = new Date().getTime();
    return {
        pk: uuid.v1(),
        sk: timestamp.toString(),
        name: name,
        dummyPayload: dummyPayload,
    };
};

const toDisplay = (data: Notfication): NotficationDisplay => {
    return {
        id: data.pk,
        name: data.name,
        dummyPayload: data.dummyPayload
    }
}