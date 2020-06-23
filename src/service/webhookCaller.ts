import * as AWS from 'aws-sdk';
import axios from 'axios'
AWS.config.region = process.env.REGIONENV;
const lambda = new AWS.Lambda();

export async function webhookCaller(url: string, token: string, payload: string) {
    var params = {
        FunctionName: 'xendit-trial-' + process.env.STAGEENV?.toLowerCase() + '-webhook-caller', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify({
            url,
            token,
            payload
        })
    };

    try {
        const data = await lambda.invoke(params).promise()
        return data;
    } catch (error) {
        throw error;
    }
};

export async function callUrl(url: string, payload: object, token: string) {
    return axios({
        method: 'post',
        url: url,
        headers: {
            'X-Callback-Token': token,
            'Content-Type': 'application/json'
        },
        timeout: 2000,
        data: payload
    })
}