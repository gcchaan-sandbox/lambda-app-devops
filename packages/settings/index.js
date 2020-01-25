const defaultEnvironments = ['production', 'staging'];

module.exports.settings = {
  service: 'lambdaops',
  environments: process.env.PERSONAL_STAGE
    ? [...defaultEnvironments, process.env.PERSONAL_STAGE]
    : defaultEnvironments,
  repo: 'gcchaan-sandbox/lambda-app-devops'
};
