import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

interface LambdaDeployStrategy {
  function: lambda.Function;
  deployConfig: codedeploy.ILambdaDeploymentConfig;
}
export class LambdaStack extends Stack {
  public readonly lambdaCode: lambda.CfnParametersCode;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.lambdaCode = lambda.Code.cfnParameters();
    const fn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { console.log("Hola!"); }'),
    });
    const lambdaDeployStrategies: LambdaDeployStrategy[] = [
      {
        function: fn,
        deployConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE
      }
    ]
    this.defineCodeDeploy(lambdaDeployStrategies)
  }
  private defineCodeDeploy(strategies: LambdaDeployStrategy[]) {
    strategies.forEach(strategy => {
      const alias = new lambda.Alias(this, 'LambdaAlias', {
        aliasName: 'Live',
        version: strategy.function.addVersion(new Date().toISOString()),
      });
      new codedeploy.LambdaDeploymentGroup(this, 'DeploymentGroup', {
        alias,
        deploymentConfig: strategy.deployConfig,
      });
    })
  }
}
