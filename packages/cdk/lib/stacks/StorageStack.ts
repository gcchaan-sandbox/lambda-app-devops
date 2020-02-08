import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { settings } from 'settings'

export class StorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new s3.Bucket(this, 'ArtifactBucket', {
      bucketName: `${settings.service}-artifact`,
    });
  }
}
