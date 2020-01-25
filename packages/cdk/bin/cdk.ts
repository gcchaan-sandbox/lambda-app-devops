#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from '@aws-cdk/core';
import { settings } from 'settings';

import { LambdaStack } from '../lib/stacks/LambdaStack';
import { PipelineStack } from '../lib/stacks/PipelineStack';
import { StorageStack } from '../lib/stacks/StorageStack';
const app = new cdk.App();
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
    }
  });
});
