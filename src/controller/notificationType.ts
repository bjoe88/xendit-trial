'use strict';
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { createNotificationType, getNotificationTypes } from '../model/notificationType';

module.exports.createNotificationType = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const requestBody = JSON.parse(event.body as string);
  const name = requestBody ? requestBody.name : null;
  const dummyPayload = requestBody ? requestBody.dummyPayload : null;
  const data = await createNotificationType(name, dummyPayload)
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

module.exports.getNotificationTypes = async (_event: APIGatewayEvent, _context: Context, _callback: Callback) => {
  const data = await getNotificationTypes()
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

