import * as fs from 'fs-extra';
import { Help, Command, toCached, Interfaces } from '@oclif/core';

class HelpHelper extends Help {
  constructor(protected commandInstance: Command, options?: Interfaces.HelpOptions) {
    super(commandInstance.config as Interfaces.Config, options);
  }

  async generateHelpText() {
    const cmd = await getCommandConfig(this.commandInstance);
    const helpText = this.formatCommand(cmd);
    return helpText;
  }
}

const quoteIfNeeded = (text: any) => {
  if (typeof text !== 'string' || /^[\d+,A-Za-z-]+$/.test(text)) {
    return `${text}`;
  }
  return `'${text}'`;
};

export class OclifUtils {
  static async getCommandConfig(commandInstance: Command): Promise<Interfaces.Command> {
    const cmd = await toCached(commandInstance.ctor as any as Interfaces.Command.Class);
    if (cmd.id === undefined) {
      cmd.id = '';
    }
    return cmd;
  }

  /**
   * Use this function to prepend command line to examples.
   * This function needs to be called from `init()` function of the Command.
   * @param commandInstance instance of the Command
   * @return void
   */
  static prependCliToExamples(commandInstance: Command): void {
    const cmd = commandInstance.ctor as any as Interfaces.Command.Class;
    if (Array.isArray(cmd.examples)) {  // so that we don't have to hard code command name in the examples
      const prepend = (s: string) => (s && s.startsWith('^ ')) ? s.replace('^', commandInstance.config.bin) : s;
      // eslint-disable-next-line unicorn/no-array-for-each
      cmd.examples.forEach((example, index, examples) => {  // replace in place
        if (typeof example === 'string') {
          examples[index] = prepend(example);
        } else if (example?.command) {
          example.command = prepend(example.command);
        }
      });
    }
  }

  /**
   * Generate formatted text content of help to a command
   * @param commandInstance instance of the Command
   * @param options format options
   * @return help content
   */
  static generateHelpText(commandInstance: Command, options?: Interfaces.HelpOptions): Promise<string> {
    const helper = new HelpHelper(commandInstance, {
      stripAnsi: true,
      maxWidth: 80,
      ...options,
    });
    return helper.generateHelpText();
  }

  static async injectHelpTextIntoReadmeMd(commandInstance: Command, options?: Interfaces.HelpOptions): Promise<void> {
    const helpText = await OclifUtils.generateHelpText(commandInstance, options);
    const helpTextMd = '```\n' + helpText + '\n```\n';

    const fileName = 'README.md';
    const helpStart = '<!-- help start -->';
    const helpEnd = '<!-- help end -->';
    let fileContent = await fs.readFile(fileName, 'utf8');
    fileContent = fileContent.replace(new RegExp(`${helpStart}(.|\n)*${helpEnd}`, 'm'), `${helpStart}\n${helpTextMd}\n${helpEnd}`);
    await fs.outputFile(fileName, fileContent);
  }

  /**
   * Reconstruct the command line from already parsed options.
   * @param commandInstance When calling from the subclass of `Command`, just pass `this`
   * @param options Already parsed options. It can be got with `const options = await OclifUtils.parseCommandLine(commandInstance);`
   * @returns the command line string corresponding to the parsed options
   */
  static reconstructCommandLine<T extends { args: Array<{ name: string }>; new(...args: any): any}>(commandInstance: InstanceType<T>, options: CommandOptions<T>): string {
    const args = new Array<string>();
    args.push(commandInstance.config.bin);
    if (options.argv?.length > 0) {
      args.push(...options.argv.map((x: string) => quoteIfNeeded(x)));
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
}

export const getCommandConfig = OclifUtils.getCommandConfig;
export const prependCliToExamples = OclifUtils.prependCliToExamples;
export const generateHelpText = OclifUtils.generateHelpText;
export const injectHelpTextIntoReadmeMd = OclifUtils.injectHelpTextIntoReadmeMd;
export const reconstructCommandLine = OclifUtils.reconstructCommandLine;

export type CommandFlags<T> = T extends Interfaces.Input<infer F> ? F : never
export type CommandArgNames<T> = T extends { name: infer A }[] ? A : never
export type CommandArgs<T extends { args?: Array<{ name: string }> }> = {
  [x in CommandArgNames<T['args']>]: string;
}
export type CommandOptions<T extends { args?: Array<{ name: string }> }> = Interfaces.ParserOutput<CommandFlags<T>, CommandArgs<T>>;
