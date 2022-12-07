#!/usr/bin/env node

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



import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';

import { ConfigurableDynamicCdkResourceProvisioningTypescriptStack } from '../lib/configurable-dynamic-cdk-resource-provisioning-typescript-stack';



const deployRegion =  String(process.env["DEPLOY_REGION"]?.toString() || process.env.CDK_DEFAULT_REGION);
const deployAccount =  String(process.env["DEPLOY_ACCOUNT"]?.toString() || process.env.CDK_DEFAULT_ACCOUNT);




function hashCode(str: string ) {
  return Array.from(str)
    .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
}

//want to make sure we have a unique app name across all accounts and regions 
const appName =  (process.env["applicationName"]?.toString() || hashCode((deployAccount+deployRegion).toString()).toString()).toString();




const app = new cdk.App();
new ConfigurableDynamicCdkResourceProvisioningTypescriptStack(app,appName, {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
  
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    env: { account: deployAccount, region: deployRegion },
  
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */

  
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  });

  