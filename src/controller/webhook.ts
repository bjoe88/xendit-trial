'use strict';
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import uuid = require('uuid');
import { createWebhook, getUserWebhook } from '../model/webhook';
import { getNotificationTypeById, NotificationDisplay } from '../model/notificationType';
import { webhookCaller, callUrl } from '../service/webhookCaller'
import * as AWS from 'aws-sdk';
AWS.config.region = process.env.REGIONENV;
const lambda = new AWS.Lambda();

module.exports.createWebhook = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const requestBody = JSON.parse(event.body as string);

  const url = requestBody ? requestBody.url : null;
  const notificationTypeId = requestBody ? requestBody.notificationTypeId : null;
  const userId = requestBody ? requestBody.userId : null;
  let token = requestBody ? requestBody.token : null;
  if (token == null) {
    token = uuid.v1();
  }
  if (url == null || notificationTypeId == null || userId == null) {
    return callback(null, {
      statusCode: 422,
      body: 'request body is incomplete'
    });
  }
  const data = await createWebhook(url, token, notificationTypeId, +userId)
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

module.exports.getUserWebhook = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const userId = event.queryStringParameters ? event.queryStringParameters['user_id'] : null;
  if (userId == null) {
    return callback(null, {
      statusCode: 422,
      body: 'user_id parameters is missing'
    });
  }
  const data = await getUserWebhook(+userId);
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

module.exports.userTestWebhook = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const requestBody = JSON.parse(event.body as string);
  const url = requestBody ? requestBody.url : null;
  const token = requestBody ? requestBody.token : null;
  const notificationTypeId = requestBody ? requestBody.notificationTypeId : null;
  const userId = requestBody ? requestBody.userId : null;
  if (url == null || token == null || notificationTypeId == null || userId == null) {
    return callback(null, {
      statusCode: 422,
      body: 'request body is incomplete'
    });
  }
  const notificationType = await getNotificationTypeById(notificationTypeId) as NotificationDisplay;
  if (notificationType == null) {
    return callback(null, {
      statusCode: 422,
      body: 'Invalid notificationTypeId'
    });
  }
  const data = await webhookCaller(url, token, notificationType.dummyPayload);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        id: uuid.v1(),
        status: data.StatusCode,
        response: data.Payload
      },
      null,
      2
    ),
  };
};

module.exports.webhookCaller = async (event: any, context: Context, callback: Callback) => {
  const url = event.url;
  const token = event.token;
  const payload = event.payload;
  let response = await callUrl(url, payload, token);
  return {
    statusCode: response.status,
    payload: response.data
  }
};