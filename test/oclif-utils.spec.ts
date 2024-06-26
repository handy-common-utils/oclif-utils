/* eslint-disable unicorn/prefer-string-replace-all */
import { Args, Command, Flags } from '@oclif/core';
import { expect } from 'chai';

import { CommandOptions, generateHelpText, reconstructCommandLine, withEnhancedFlagsHandled } from '../src';

class TestCommand extends Command {
  static Options: CommandOptions<typeof TestCommand>;

  static description = 'Visualisation of AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow\n' +
    `This command line tool can visualise AWS serverless (Lambda, API Gateway, SNS, SQS, etc.) dataflow. 
It generates website files locally and can optionally launch a local server for you to preview.`.replace(/\n/g, '') +
`\n\nBefore running this tool, you need to log into your AWS account (through command line like aws, saml2aws, okta-aws, etc.) first. 
\nThis tool is free and open source: https://github.com/james-hu/aws-serverless-dataflow`;

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: { ...Flags.help({ char: 'h' }), parse: async (_: any, cmd: Command) => {
      cmd.log(await generateHelpText(cmd));
      cmd.exit(0);
    } },
    'update-readme.md': Flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),

    region: Flags.string({ char: 'r', description: 'AWS region (required if you don\'t have AWS_REGION environment variable configured)' }),

    include: Flags.string({ char: 'i', default: ['*'], multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be included' }),
    exclude: Flags.string({ char: 'x', multiple: true, description: 'wildcard patterns for domain names and ARN of Lambda functions/SNS topics/SQS queues that should be excluded' }),

    'cloud-formation': Flags.boolean({ char: 'c', default: false, description: 'survey CloudFormation stack information (this takes more time)' }),

    server: Flags.boolean({ char: 's', description: 'start a local http server and open a browser for pre-viewing generated website' }),
    port: Flags.integer({ char: 'p', default: 8002, description: 'port number of the local http server for preview' }),

    parallelism: Flags.integer({ char: 'l', default: 2, description: 'approximately how many AWS API calls are allowed at the same time' }),
    quiet: Flags.boolean({ char: 'q', description: 'no console output' }),
    debug: Flags.boolean({ char: 'd', description: 'output debug messages' }),

    generateHelpText: Flags.boolean({ hidden: true, description: 'For testing generateHelpText(...)' }),
  };

  static args = {
    path: Args.string({ name: 'path', default: 'dataflow', description: 'path for putting generated website files' }),
    depth: Args.integer({ name: 'depth', default: 5, description: 'a sample argument' }),
  };

  static examples = [
    '^ -r ap-southeast-2 -s',
    `^ -r ap-southeast-2 -s -i '*boi*' -i '*datahub*' \\
      -x '*jameshu*' -c`,
    `^ -r ap-southeast-2 -s -i '*lr-*' \\
      -i '*lead*' -x '*slack*' -x '*lead-prioritization*' \\
      -x '*lead-scor*' -x '*LeadCapture*' -c`,
    {
      description: 'this command line shows how to run it',
      command: '^ . -r ap-southeast-2 -s',
    },
  ];

  protected async init() {
    return super.init();
  }

  async run() {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(TestCommand));
    testResultOptions = options;

    if (testResultExitCode !== undefined) {
      return;
    }

    this.log(`${options.args.depth}`);
    this.log(options.args.path);

    /*
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this);
      return;
    }
    */
    if (options.flags.generateHelpText) {
      testResultHelpText = await generateHelpText(this);
    }

    const commandLine = reconstructCommandLine(this, options);
    testResultCommandLine = commandLine;
  }

  log(message: string, ..._args: any[]): void {
    testResultLastLog = message;
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  exit = ((code: number) => {
    testResultExitCode = code;
  }) as Command['exit'];
}

let testResultOptions: typeof TestCommand.Options;
let testResultHelpText: string;
let testResultCommandLine: string;
let testResultLastLog: string;
let testResultExitCode: number;

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
      args: { path: 'api-doc', depth: 8 },
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
      '9',
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
    expect(testResultCommandLine).to.eq("mocha 9 api-doc --include '*xyz*' 'abc and d' --exclude x1 --server --port 8002 --parallelism 10");
  });

  it('should generateHelpText', async () => {
    await TestCommand.run([
      '--generateHelpText',
    ]);
    expect(testResultHelpText).to.include('USAGE');
    expect(testResultHelpText).to.include(' [PATH] [DEPTH]'); // $ mocha testcommand [PATH] [DEPTH]
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
    expect(testResultHelpText).to.include('this command line shows how to run it');
    expect(testResultHelpText).to.include(' -r ap-southeast-2 -s');
  });

  it('should -v work', async () => {
    await TestCommand.run([
      '-v',
    ]);
    expect(testResultExitCode).to.equal(0);
    expect(testResultLastLog).to.include('node-v'); // 'mocha/10.2.0 linux-x64 node-v16.20.0'
  });

  it('should --help work', async () => {
    await TestCommand.run([
      '--help',
    ]);

    expect(testResultExitCode).to.equal(0);
    expect(testResultLastLog).to.include('USAGE');
    expect(testResultLastLog).to.include('ARGUMENTS');
    expect(testResultLastLog).to.include('FLAGS');
    expect(testResultLastLog).to.include('DESCRIPTION');
    expect(testResultLastLog).to.include('EXAMPLES');
  });
});
