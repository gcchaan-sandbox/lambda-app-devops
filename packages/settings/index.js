module.exports.settings = {
  service: 'lambdaops',
  stage: process.env.STAGE
    ? process.env.STAGE
    : 'production',
  repo: 'gcchaan-sandbox/lambda-app-devops'
};
