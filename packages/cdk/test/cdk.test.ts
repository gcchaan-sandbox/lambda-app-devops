import { expect as expectCDK, MatchStyle,matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

import { LambdaStack } from '../lib/stacks/LambdaStack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
