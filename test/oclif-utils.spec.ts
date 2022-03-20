import { Command, Flags } from '@oclif/core';
import { OclifUtils, CommandOptions } from '../src/oclif-utils';
import { expect } from 'chai';

class TestCommand extends Command {
  static description = 'Visualisation of AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow\n' +
    `This command line tool can visualise AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow. 
It generates website files locally and can optionally launch a local server for you to preview.`.replace(/\n/g, '') +
`\n\nBefore running this tool, you need to log into your AWS account (through command line like aws, saml2aws, okta-aws, etc.) first. 
\nThis tool is free and open source: https://github.com/james-hu/aws-serverless-dataflow`;

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: Flags.help({ char: 'h' }),
    'update-readme.md': Flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),

    region: Flags.string({ char: 'r', description: 'AWS region (required if you don\'t have AWS_REGION environment variable configured)' }),

    include: Flags.string({ char: 'i', default: ['*'], multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be includeed' }),
    exclude: Flags.string({ char: 'x', multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be excluded' }),

    'cloud-formation': Flags.boolean({ char: 'c', default: false, description: 'survey CloudFormation stack information (this takes more time)' }),

    server: Flags.boolean({ char: 's', description: 'start a local http server and open a browser for pre-viewing generated website' }),
    port: Flags.integer({ char: 'p', default: 8002, description: 'port number of the local http server for preview' }),

    parallelism: Flags.integer({ char: 'l', default: 2, description: 'approximately how many AWS API calls are allowed at the same time' }),
    quiet: Flags.boolean({ char: 'q', description: 'no console output' }),
    debug: Flags.boolean({ char: 'd', description: 'output debug messages' }),

    generateHelpText: Flags.boolean({ hidden: true, description: 'For testing generateHelpText(...)' }),
  };

  static args = [
    { name: 'path' as const, default: 'dataflow', description: 'path for putting generated website files' },
    { name: 'depth' as const, default: '5', description: 'a sample argument' },
  ];

  static examples = [
    '^ -r ap-southeast-2 -s',
    `^ -r ap-southeast-2 -s -i '*boi*' -i '*datahub*' \\
      -x '*jameshu*' -c`,
    `^ -r ap-southeast-2 -s -i '*lr-*' \\
      -i '*lead*' -x '*slack*' -x '*lead-prioritization*' \\
      -x '*lead-scor*' -x '*LeadCapture*' -c`,
  ];

  protected async init() {
    OclifUtils.prependCliToExamples(this);
    return super.init();
  }

  async run() {
    const options = await this.parse() as CommandOptions<typeof TestCommand>;
    testResultOptions = options;
    /*
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this);
      return;
    }
    */
    if (options.flags.generateHelpText) {
      testResultHelpText = await OclifUtils.generateHelpText(this);
    }

    const commandLine = OclifUtils.reconstructCommandLine(this, options);
    testResultCommandLine = commandLine;
  }
}

let testResultOptions: CommandOptions<typeof TestCommand>;
let testResultHelpText: string;
let testResultCommandLine: string;

describe('OclifUtils', () => {
  it('should parseCommandLine(...) work', async () => {
    await TestCommand.run([
      'api-doc',
      '8',
      '-l',
      '10',
      '-i',
      '*xyz*',
      '-x',
      'x1',
      '-i',
      'abc and d',
      '--server',
    ]);
    expect({ args: testResultOptions.args, flags: testResultOptions.flags }).to.eql({
      args: { path: 'api-doc', depth: '8' },
      flags: {
        parallelism: 10,
        include: ['*xyz*', 'abc and d'],
        exclude: ['x1'],
        'cloud-formation': false,
        port: 8002,
        server: true,
      },
    });
  });

  it('should rebuildCommandLine(...) work', async () => {
    await TestCommand.run([
      'api-doc',
      '8 and eight',
      '-l',
      '10',
      '-i',
      '*xyz*',
      '-x',
      'x1',
      '-i',
      'abc and d',
      '--server',
    ]);
    expect(testResultCommandLine).to.eq("@handy-common-utils/oclif-utils api-doc '8 and eight' --parallelism 10 --include '*xyz*' 'abc and d' --exclude x1 --server --port 8002");
  });

  it('should generateHelpText', async () => {
    await TestCommand.run([
      '--generateHelpText',
    ]);
    expect(testResultHelpText).to.include('USAGE');
    expect(testResultHelpText).to.include('$ @handy-common-utils/oclif-utils  [PATH] [DEPTH]');
    expect(testResultHelpText).to.include('ARGUMENTS');
    expect(testResultHelpText).to.include('PATH   [default: dataflow] path for putting generated website files');
    expect(testResultHelpText).to.include('DEPTH  [default: 5] a sample argument');
    expect(testResultHelpText).to.include('FLAGS');
    expect(testResultHelpText).to.include('-d, --debug                output debug messages');
    expect(testResultHelpText).to.include('-x, --exclude=<value>');
    expect(testResultHelpText).to.include('DESCRIPTION');
    expect(testResultHelpText).to.include('Visualisation of AWS serverless');
    expect(testResultHelpText).to.include('This tool is free and open source');
    expect(testResultHelpText).to.include('EXAMPLES');
    expect(testResultHelpText).to.include('$ @handy-common-utils/oclif-utils -r ap-southeast-2 -s');
  });
});
