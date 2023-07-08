import { Help, Command, Interfaces } from '@oclif/core';
import { replaceInFile } from '@handy-common-utils/fs-utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export function generateHelpText(commandInstance: Command, options?: Partial<Interfaces.HelpOptions>): Promise<string> {
  const helper = new HelpHelper(commandInstance, {
    stripAnsi: true,
    maxWidth: 80,
    ...options,
  });
  return helper.generateHelpText();
}

/**
 * Replace the help text in the `README.md` file.
 * Help text is marked by `<!-- help start -->` and `<!-- help end -->`.
 * @param commandInstance instance of the Command
 * @param options (optional) format options
 * @returns void
 */
export async function injectHelpTextIntoReadmeMd(commandInstance: Command, options?: Partial<Interfaces.HelpOptions>): Promise<void> {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CommandOptions<C> = C extends Input<infer _F extends OutputFlags<any>, infer _B extends OutputFlags<any>, infer _A extends OutputFlags<any>> ? Awaited<ParsedOutput<FBA<C>>> : never;
