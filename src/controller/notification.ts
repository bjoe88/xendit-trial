'use strict';
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { createNotification } from '../model/notification';

module.exports.createNotificationType = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const requestBody = JSON.parse(event.body as string);
  const name = requestBody ? requestBody.name : null;
  const dummyPayload = requestBody ? requestBody.dummyPayload : null;
  const data = await createNotification(name, dummyPayload)
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };

};
