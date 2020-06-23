
import uuid = require('uuid');
import AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "notification-table";
export interface Notification {
    pk: string
    sk: string
    name: string
    dummyPayload: string
    "gsi-pk1": string
    "gsi-sk1": string
}

export interface NotificationDisplay {
    id: string
    name: string
    dummyPayload: string
}

export async function createNotificationType(name: string, dummyPayload: string) {
    const notification = notificationData(name, dummyPayload);
    const notificationInfo = {
        TableName: TABLE_NAME,
        Item: notification,
    };
    return dynamoDb.put(notificationInfo).promise()
        .then(res => toDisplay(notification));
};

export async function getNotificationTypes() {
    var params = {
        TableName: TABLE_NAME,
        IndexName: "gsi1",
        KeyConditionExpression: "#gsipk=:pk",
        ExpressionAttributeValues: {
            ":pk": "notification-type"
        },
        ExpressionAttributeNames: {
            "#gsipk": "gsi-pk1"
        }
    }
    let result = await dynamoDb.query(params).promise();
    return result.Items?.map((ele) => {
        return toDisplay(ele as Notification);
    })
};

export async function getNotificationTypeById(id: string): Promise<NotificationDisplay | undefined> {
    var params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "#pk=:pk",
        ExpressionAttributeValues: {
            ":pk": id
        },
        ExpressionAttributeNames: {
            "#pk": "pk"
        }
    }
    let result = await dynamoDb.query(params).promise();
    let data = result.Items?.map((ele) => {
        return toDisplay(ele as Notification);
    })
    return data?.shift()
};
const notificationData = (name: string, dummyPayload: string): Notification => {
    const timestamp = new Date().getTime();
    return {
        pk: uuid.v1(),
        sk: timestamp.toString(),
        name: name,
        dummyPayload: dummyPayload,
        "gsi-pk1": "notification-type",
        "gsi-sk1": timestamp.toString()
    };
};

const toDisplay = (data: Notification): NotificationDisplay => {
    return {
        id: data.pk,
        name: data.name,
        dummyPayload: data.dummyPayload
    }
}