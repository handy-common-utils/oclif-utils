import { replaceInFile } from '@handy-common-utils/fs-utils';
import { Command, Flags, Help, Interfaces } from '@oclif/core';
import { Input, OutputFlags, ParserOutput } from '@oclif/core/lib/interfaces/parser';

/**
 * Helper class to utilise protected method formatCommand(...) in the parent class
 */
class HelpHelper extends Help {
  constructor(protected commandInstance: Command, options?: Interfaces.HelpOptions) {
    super(commandInstance.config as Interfaces.Config, options);
  }

  async generateHelpText() {
    const helpText = this.formatCommand(this.commandInstance.constructor as any);
    return helpText;
  }
}

const quoteIfNeeded = (text: any) => {
  if (typeof text !== 'string' || /^[\d+,A-Za-z-]+$/.test(text)) {
    return `${text}`;
  }
  return `'${text}'`;
};

/**
 * Generate formatted text content of help to a command
 * @param commandInstance instance of the Command
 * @param options (optional) format options
 * @return help content
 */
export function generateHelpText<T extends Command>(commandInstance: T, options?: Partial<Interfaces.HelpOptions>): Promise<string> {
  const helper = new HelpHelper(commandInstance, {
    stripAnsi: true,
    maxWidth: 80,
    ...options,
  });
  return helper.generateHelpText();
}

/**
 * Flags of '--help'/'-h' and '--version'/'-v' and --update-readme.md'
 */
export const enhancedFlags = {
  help: Flags.boolean({ required: false, char: 'h', description: 'Show help' }),
  version: Flags.boolean({ required: false, char: 'v', description: 'Show CLI version' }),
  'update-readme.md': Flags.boolean({ hidden: true, required: false, description: 'For developers only, don\'t use' }),
};

/**
 * Parse command line arguments, with enhanced flags handled
 * @param commandInstance Instance of the command class, usually 'this'
 * @param parse The function to call 'this.parse(<The class>)`
 * @param helpOptions Optional options to customise the formatting of help text
 * @param additionalHandler Optional additional handler
 * @returns Output from 'this.parse(<The class>)'.
 * @throws Error if the command line arguments are considered invalid by 'this.parse(<The class>)'.
 */
export async function withEnhancedFlagsHandled<T extends { argv: string[]; log: Command['log']; exit: Command['exit']; new(...args: any): any}, O>(
  commandInstance: InstanceType<T>,
  parse: () => Promise<O>,
  helpOptions?: Partial<Interfaces.HelpOptions>,
  additionalHandler?: (commandInstance: InstanceType<T>, cliOptions: O | undefined) => Promise<void>,
): Promise<O> {
  let cliOptions;
  let parsingError;
  try {
    cliOptions = await parse();
  } catch (error) {
    parsingError = error;
  }

  const onlyArg = commandInstance.argv?.length === 1 ? commandInstance.argv[0] : undefined;
  switch(onlyArg) {
    case '--help':
    case '-h': {
      const helpText = await generateHelpText(commandInstance, helpOptions);
      commandInstance.log(helpText);
      commandInstance.exit(0);
      break;
    }
    case '--version':
    case '-v': {
      commandInstance.log(commandInstance.config.userAgent);
      commandInstance.exit(0);
      break;
    }
    case '--update-readme.md': {
      await injectHelpTextIntoReadmeMd(commandInstance);
      commandInstance.exit(0);
      break;
    }
  }

  if (additionalHandler) {
    await additionalHandler(commandInstance, cliOptions);
  }

  if (cliOptions) {
    return cliOptions;
  } else {
    throw parsingError;
  }
}

/**
 * Replace the help text in the `README.md` file.
 * Help text is marked by `<!-- help start -->` and `<!-- help end -->`.
 * @param commandInstance instance of the Command
 * @param options (optional) format options
 * @returns void
 */
export async function injectHelpTextIntoReadmeMd<T extends Command>(commandInstance: T, options?: Partial<Interfaces.HelpOptions>): Promise<void> {
  const helpText = await generateHelpText(commandInstance, options);
  const helpTextMd = '```\n' + helpText + '\n```\n';

  const fileName = 'README.md';
  const helpStart = '<!-- help start -->';
  const helpEnd = '<!-- help end -->';
  await replaceInFile(fileName, new RegExp(`${helpStart}(.|\n)*${helpEnd}`, 'm'), `${helpStart}\n${helpTextMd}\n${helpEnd}`);
}

/**
 * Reconstruct the command line from already parsed options.
 * @param commandInstance When calling from the subclass of `Command`, just pass `this`
 * @param options Already parsed options. When calling from the subclass of `Command`, it is the return value of `this.parse(...)`.
 * @returns the command line string corresponding to the parsed options
 */
export function reconstructCommandLine<T extends { args: Array<{ name: string }>; new(...args: any): any}>(commandInstance: InstanceType<T>, options: Awaited<ReturnType<Command['parse']>>): string {
  const args = new Array<string>();
  args.push(commandInstance.config.bin);
  if (options.argv?.length > 0) {
    args.push(...options.argv.map((x: any) => quoteIfNeeded(x)));
  }
  if (options.flags) {
    for (const flagName of Object.keys(options.flags)) {
      const flagValue = options.flags[flagName];
      if (flagValue !== false) {  // no need if the flag is not toggled on
        args.push(`--${flagName}`);
        if (typeof flagValue !== 'boolean') {
          if (Array.isArray(flagValue)) {
            for (const value of flagValue) {
              args.push(`${quoteIfNeeded(value)}`);
            }
          } else {
            args.push(`${quoteIfNeeded(flagValue)}`);
          }
        }
      }
    }
  }
  return args.join(' ');
}

type FBA<C> = C extends Input<infer F, infer B, infer A> ? [F, B, A] : never;
type ParsedOutput<FBA> = FBA extends [infer F extends OutputFlags<any>, infer B extends OutputFlags<any>, infer A extends OutputFlags<any>] ? ParserOutput<F, B, A> : never;
/**
 * Typical usage: `CommandOptions<typeof YourCommand>`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CommandOptions<C> = C extends Input<infer _F extends OutputFlags<any>, infer _B extends OutputFlags<any>, infer _A extends OutputFlags<any>> ? Awaited<ParsedOutput<FBA<C>>> : never;
