/* eslint-disable no-use-before-define */
import { Command, flags } from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OclifUtils, CommandOptions } from '../src/oclif-utils';
import { expect } from 'chai';

class TestCommand extends Command {
  static description = 'Visualisation of AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow\n' +
    `This command line tool can visualise AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow. 
It generates website files locally and can optionally launch a local server for you to preview.`.replace(/\n/g, '') +
`\n\nBefore running this tool, you need to log into your AWS account (through command line like aws, saml2aws, okta-aws, etc.) first. 
\nThis tool is free and open source: https://github.com/james-hu/aws-serverless-dataflow`;

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),

    region: flags.string({ char: 'r', description: 'AWS region (required if you don\'t have AWS_REGION environment variable configured)' }),

    include: flags.string({ char: 'i', default: ['*'], multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be includeed' }),
    exclude: flags.string({ char: 'x', multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be excluded' }),

    'cloud-formation': flags.boolean({ char: 'c', default: false, description: 'survey CloudFormation stack information (this takes more time)' }),

    server: flags.boolean({ char: 's', description: 'start a local http server and open a browser for pre-viewing generated website' }),
    port: flags.integer({ char: 'p', default: 8002, description: 'port number of the local http server for preview' }),

    parallelism: flags.integer({ char: 'l', default: 2, description: 'approximately how many AWS API calls are allowed at the same time' }),
    quiet: flags.boolean({ char: 'q', description: 'no console output' }),
    debug: flags.boolean({ char: 'd', description: 'output debug messages' }),
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
    const options = OclifUtils.parseCommandLine<typeof TestCommand>(this);
    // const options = this.parse<CommandFlags<typeof TestCommand>, CommandArgs<typeof TestCommand>>(TestCommand, argv);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    testResultOptions = options;
    /*
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this);
      return;
    }
    */

    const commandLine = OclifUtils.reconstructCommandLine(this);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    testResultCommandLine = commandLine;
  }
}

let testResultOptions: CommandOptions<typeof TestCommand>;
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
});
