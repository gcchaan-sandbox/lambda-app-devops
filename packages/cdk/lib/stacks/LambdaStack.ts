import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export interface LambdaStackProps extends StackProps {
  readonly artifactBucket: s3.Bucket,
}
interface LambdaDeployStrategy {
  function: lambda.Function;
  deployConfig: codedeploy.ILambdaDeploymentConfig;
}
export class LambdaStack extends Stack {
  // public readonly lambdaCode: lambda.CfnParametersCode;
  readonly lambdaFunction: lambda.Function;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    // this.lambdaCode = lambda.Code.cfnParameters();
    this.lambdaFunction = new lambda.Function(this, 'MyFunction', {
      description: `Generated on: ${new Date().toISOString()}`,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.awesomeBatch',
      code: lambda.Code.fromBucket(props.artifactBucket, `production/function-batch/artifact.zip`)
    });
    const lambdaDeployStrategies: LambdaDeployStrategy[] = [
      {
        function: this.lambdaFunction,
        deployConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE
      }
    ]
    this.defineCodeDeploy(lambdaDeployStrategies)
  }
  private defineCodeDeploy(strategies: LambdaDeployStrategy[]) {
    strategies.forEach(strategy => {
      const version = strategy.function.addVersion(new Date().toISOString());
      const alias = new lambda.Alias(this, 'LambdaAlias', {
        aliasName: 'live',
        version: version,
      });
      new codedeploy.LambdaDeploymentGroup(this, 'DeploymentGroup', {
        alias,
        deploymentConfig: strategy.deployConfig,
      });
    })
  }
}
