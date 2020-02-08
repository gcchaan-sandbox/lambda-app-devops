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
  let githubToken: string;
  if(process.env.PREPARE && process.env.PREPARE === 'true') {
    const request = {
      Name: `/${settings.service}/GITHUB_TOKEN`,
      WithDecryption: true
    };
    const ssmGithubTokenResponse = await ssm.getParameter(request).promise();
    githubToken = ssmGithubTokenResponse.Parameter?.Value || ''
  }
  // console.log(ssmGithubTokenResponse.Parameter?.Value);
  const props: cdk.StackProps = {
    tags: {
      RandD: settings.service
    }
  }

  // non-Stage Stack
  const storageStack = new StorageStack(app, `${settings.service}-storage`, props);

  // Stage Stack
  settings.environments.forEach(env => {
    const lambdaStack = new LambdaStack(app, `${settings.service}-lambda-${env}`, {
      ...props,
      artifactBucket: storageStack.artifactBucket,
    });
    new PipelineStack(app, `${settings.service}-pipeline-${env}`, {
      ...props,
      // lambdaCode: lambdaStack.lambdaCode,
      lambdaFunction: lambdaStack.lambdaFunction,
      githubToken: githubToken,
    });
  });
}
main();
