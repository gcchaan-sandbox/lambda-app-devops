import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { settings } from 'settings'

export class StorageStack extends cdk.Stack {
  readonly artifactBucket: s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
      bucketName: `${settings.service}-artifact`,
    });
    new cdk.CfnOutput(this, 'ArtifactBucketName', {
      exportName: `${settings.service}ArtifactBucketName`,
      value: this.artifactBucket.bucketName
    })
  }
}
