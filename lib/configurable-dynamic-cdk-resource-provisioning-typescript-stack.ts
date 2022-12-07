
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




import { Stack, StackProps } from 'aws-cdk-lib';

import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';



export class ConfigurableDynamicCdkResourceProvisioningTypescriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
    // using env vars to configure application
    const numberOfQueues = +(process.env["NUMBER_OF_QUEUES"]?.toString() || 1);
    const queueName= process.env["QUEUE_NAME"]?.toString() || "testQueue";
    const applicationName = process.env["applicationName"]?.toString() || "testcdk";
    const completeQueueName = applicationName + "-" + queueName;
    const bucketNames = process.env["BUCKET_NAMES"]?.toString() || "['testcdkbucket']";
    const deployRegion =  String(process.env["DEPLOY_REGION"]?.toString().toLocaleLowerCase() || process.env.CDK_DEFAULT_REGION);
    const deployAccount =  String(process.env["DEPLOY_ACCOUNT"]?.toString() || process.env.CDK_DEFAULT_ACCOUNT);

    
    // a simple hash function to obfuscate strings. DO NO USE IN PRODUCTION. use a better hash function. 
    function hashCode(str: string) {
      return Array.from(str)
        .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
    }




    // sample code to use a function for creation of configurable  number of resources
    function makeQueue( scope: Construct, queueName: string=completeQueueName, createCount: number= numberOfQueues): void {
      for (let i = 0; i < createCount; i++) {
            const queue = new sqs.Queue(scope, `${queueName}-${i}`, {
              queueName: `${queueName}-${i}`,
              visibilityTimeout: cdk.Duration.seconds(300),
            });
      }
    };
    makeQueue(this, completeQueueName,numberOfQueues);


    // sample code to use a loop in the construct instead of a function for creation of configurable  number of resources
    // foreach loop on bucketNames to create buckets
    // "bucket1, bucket2, bucket2"
    const bucketNamesArray: Array<string> = bucketNames.split(",");
    bucketNamesArray.forEach((bucketName: string) => {
      bucketName = applicationName.toLocaleLowerCase()+"-"+bucketName.toLocaleLowerCase()+"-"+deployRegion;

      bucketName += hashCode(deployAccount).toString();
      const bucket = new s3.Bucket(this,bucketName , {
        bucketName: bucketName,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });


    }); 


  }
}


