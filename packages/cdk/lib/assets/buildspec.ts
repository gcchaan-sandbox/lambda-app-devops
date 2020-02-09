export const buildSpecCDK = {
    version: '0.2',
    phases: {
      install: {
        'runtime-versions': {
          'nodejs': 12,
        },
        commands: [
          'yarn --version',
        ]
      },
      pre_build: {
        commands: 'yarn install',
      },
      build: {
        commands: [
          'yarn run lint',
          'yarn run test',
          'cd packages/cdk',
          'yarn run build',
          'npx cdk synth -o dist'
        ],
      },
    },
    artifacts: {
      'base-directory': 'packages/cdk/dist',
      files: [
        'lambdaops-lambda-production.template.json',
      ],
    },
  }

export const buildSpecLambda = {
  version: '0.2',
  phases: {
    install: {
      'runtime-versions': {
        'nodejs': 12,
      },
      commands: [
        'yarn --version',
      ]
    },
    pre_build: {
      commands: 'yarn install',
    },
    build: {
      commands: [
        'cd packages/function-batch',
        'yarn run build',
        // 'yarn run deploy',
        // S3にする
        // 'aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$ZIP_FILE --publish',
        // バージョンに対してE2Eテストしてリリース?
      ],
    },
  },
  artifacts: {
    'base-directory': 'packages/function-batch/dist',
    files: [
      'artifact.zip',
    ],
  },
}
