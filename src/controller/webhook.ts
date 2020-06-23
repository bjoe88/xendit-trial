'use strict';
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { createWebhook, getUserWebhook } from '../model/webhook';

module.exports.createWebhook = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
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

