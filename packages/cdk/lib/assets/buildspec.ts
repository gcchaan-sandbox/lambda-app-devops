export const buildSpecCDK = {
    version: '0.2',
    phases: {
      install: {
        commands: [
          '# install yarn',
          'sudo apt-get update && sudo apt-get install apt-transport-https',
          'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -',
          'echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list',
          'sudo apt-get update && sudo apt-get install yarn',
          'yarn --version',
        ]
      },
      pre_build: {
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
  }

export const buildSpecLambda = {
  version: '0.2',
  phases: {
    install: {
      commands: [
        'cd lambda',
        'npm install',
      ],
    },
    build: {
      commands: [
        'yarn run build',
        'aws s3 cp ./ s3://bucket',
        // S3にする
        'aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$ZIP_FILE --publish',
        // バージョンに対してE2Eテストしてリリース?
      ],
    },
  },
  artifacts: {
    'base-directory': 'lambda',
    files: [
      'index.js',
      'node_modules/**/*',
    ],
  },
}
