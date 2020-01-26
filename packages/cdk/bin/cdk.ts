#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from '@aws-cdk/core';
import * as AWS from 'aws-sdk';
import { settings } from 'settings';

import { LambdaStack } from '../lib/stacks/LambdaStack';
import { PipelineStack } from '../lib/stacks/PipelineStack';
import { StorageStack } from '../lib/stacks/StorageStack';
// eslint-disable-next-line import/namespace
const ssm = new AWS.SSM({apiVersion: 'latest', region: 'ap-northeast-1'});
const app = new cdk.App();

async function main() {
  const request = {
    Name: `/${settings.service}/GITHUB_TOKEN`,
    WithDecryption: true
  };
  const ssmGithubTokenResponse = await ssm.getParameter(request).promise();
  // console.log(ssmGithubTokenResponse.Parameter?.Value);
  const props: cdk.StackProps = {
    tags: {
      RandD: settings.service
    }
  }

  // non-Stage Stack
  new StorageStack(app, `${settings.service}-storage`, props);

  // Stage Stack
  settings.environments.forEach(env => {
    const lambdaStack = new LambdaStack(app, `${settings.service}-lambda-${env}`, props);
    new PipelineStack(app, `${settings.service}-pipeline-${env}`, {
      ...props,
      ...{
        lambdaCode: lambdaStack.lambdaCode,
        githubToken: ssmGithubTokenResponse.Parameter?.Value!,
      }
    });
  });
}
main();
