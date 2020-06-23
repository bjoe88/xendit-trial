
import uuid = require('uuid');
import AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "notification-table";
export interface Webhook {
    pk: string
    sk: string
    url: string
    token: string
    "gsi-pk1": string
    "gsi-sk1": string
    "gsi-pk2": string
    "gsi-sk2": string
}

export interface WebhookDisplay {
    id: string
    url: string
    token: string
    notificationTypeId: string
    userId: number
}

export async function createWebhook(url: string, token: string, notificationTypeId: string, userId: number) {
    const webhook = webHookData(url, token, notificationTypeId, userId);
    const webHookInfo = {
        TableName: TABLE_NAME,
        Item: webhook,
    };
    return dynamoDb.put(webHookInfo).promise()
        .then(res => toDisplay(webhook));
};

export async function getUserWebhook(userId: number) {
    var params = {
        TableName: TABLE_NAME,
        IndexName: "gsi2",
        KeyConditionExpression: "#gsipk=:pk and #gsisk=:sk",
        ExpressionAttributeValues: {
            ":pk": userId.toString(),
            ":sk": 'webhook'
        },
        ExpressionAttributeNames: {
            "#gsipk": "gsi-pk2",
            "#gsisk": "gsi-sk2"
        }
    }
    let result = await dynamoDb.query(params).promise();
    return result.Items?.map((ele) => {
        return toDisplay(ele as Webhook);
    })
};

const webHookData = (url: string, token: string, notificationTypeId: string, userId: number): Webhook => {
    const timestamp = new Date().getTime();
    return {
        pk: uuid.v1(),
        sk: timestamp.toString(),
        url: url,
        token: token,
        "gsi-pk1": notificationTypeId,
        "gsi-sk1": "webhook",
        "gsi-pk2": userId.toString(),
        "gsi-sk2": "webhook"
    };
};

const toDisplay = (data: Webhook): WebhookDisplay => {
    return {
        id: data.pk,
        url: data.url,
        token: data.token,
        notificationTypeId: data["gsi-pk1"],
        userId: +data["gsi-pk2"]
    }
}