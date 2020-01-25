import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, SecretValue,Stack, StackProps } from '@aws-cdk/core';
import { settings } from 'settings';

export interface PipelineStackProps extends StackProps {
  readonly lambdaCode: lambda.CfnParametersCode;
}

const [ owner, repositoryName ] = settings.repo.split('/');
const branch = 'master';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: 'yarn install',
          },
          build: {
            commands: [
              'yarn run lint',
              'yarn run build',
              'cd packages/cdk && npx cdk synth -o dist'
            ],
          },
        },
        artifacts: {
          'base-directory': 'packages/cdk/dist',
          files: [
            'lambdaops-lambda-production.template.json',
          ],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });
    const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
      // buildSpec: codebuild.BuildSpec.fromObject({
      //   version: '0.2',
      //   phases: {
      //     install: {
      //       commands: [
      //         'cd lambda',
      //         'npm install',
      //       ],
      //     },
      //     build: {
      //       commands: 'npm run build',
      //     },
      //   },
      //   artifacts: {
      //     'base-directory': 'lambda',
      //     files: [
      //       'index.js',
      //       'node_modules/**/*',
      //     ],
      //   },
      // }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');
    new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'Github',
              owner: owner,
              repo: repositoryName,
              branch: branch,
              oauthToken: SecretValue.ssmSecure(`/${settings.service}/${process.env.STAGE}/GITHUB_TOKEN`, '1'),
              trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            // new codepipeline_actions.CodeBuildAction({
            //   actionName: 'Lambda_Build',
            //   project: lambdaBuild,
            //   input: sourceOutput,
            //   outputs: [lambdaBuildOutput],
            // }),
            new codepipeline_actions.CodeBuildAction({
              actionName: 'CDK_Build',
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput],
            }),
          ],
        },
        // {
        //   stageName: 'Deploy',
        //   actions: [
        //     new codepipeline_actions.CloudFormationCreateUpdateStackAction({
        //       actionName: 'Lambda_CFN_Deploy',
        //       templatePath: cdkBuildOutput.atPath('LambdaStack.template.json'),
        //       stackName: 'LambdaDeploymentStack',
        //       adminPermissions: true,
        //       parameterOverrides: {
        //         ...props.lambdaCode,
        //         ...lambdaBuildOutput.s3Location,
        //       },
        //       extraInputs: [lambdaBuildOutput],
        //     }),
        //   ],
        // },
      ],
    });
  }
}
