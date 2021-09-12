/* eslint-disable max-depth */
import * as fs from 'fs-extra';
import * as Config from '@oclif/config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Command } from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HelpOptions, Help } from '@oclif/plugin-help';
import * as Parser from '@oclif/parser';
import { CliConsole } from './cli-console';

export function getCommandConfig(commandInstance: Command): Config.Command {
  const cmd = Config.Command.toCached(commandInstance.ctor as any as Config.Command.Class);
  if (cmd.id === undefined) {
    cmd.id = '';
  }
  return cmd;
}

class SingleCommandHelp extends Help {
  constructor(protected commandInstance: Command, options?: Partial<HelpOptions>) {
    super(commandInstance.config, options);
  }

  generateHelpText() {
    const cmd = getCommandConfig(this.commandInstance);

    const helpText = this.formatCommand(cmd);
    return helpText;
  }
}

export interface OclifHelpContent {
  usage?: string;
  args?: string;
  flags?: string;
  description?: string;
  aliases?: string;
  examples?: string;
}

const quoteIfNeeded = (text: any) => {
  if (typeof text !== 'string' || /^[\d+,A-Za-z-]+$/.test(text)) {
    return `${text}`;
  }
  return `'${text}'`;
};

// eslint-disable-next-line unicorn/no-static-only-class
export class OclifUtils {
  static getCommandConfig(commandInstance: Command): Config.Command {
    return getCommandConfig(commandInstance);
  }

  /**
   * Use this function to prepend command line to examples.
   * This function needs to be called from `init()` function of the Command.
   * @param commandInstance instance of the Command
   * @return void
   */
  static prependCliToExamples(commandInstance: Command): void {
    const cmd = commandInstance.ctor as any as Config.Command.Class;
    if (Array.isArray(cmd.examples)) {  // so that we don't have to hard code command name in the examples
      cmd.examples = cmd.examples.map(s => s.startsWith('^ ') ? s.replace('^', commandInstance.config.bin) : s);
    }
  }

  /**
   * Generate formatted text content of help to a command
   * @param commandInstance instance of the Command
   * @param options format options
   * @return help content
   */
  static generateHelpText(commandInstance: Command, options?: Partial<HelpOptions>): string {
    const help = new SingleCommandHelp(commandInstance, {
      stripAnsi: true,
      maxWidth: 80,
      ...options,
    });
    return help.generateHelpText();
  }

  static async injectHelpTextIntoReadmeMd(commandInstance: Command, options?: Partial<HelpOptions>): Promise<void> {
    const helpText = OclifUtils.generateHelpText(commandInstance, {
      stripAnsi: true,
      maxWidth: 80,
      ...options,
    });
    const helpTextMd = '```\n' + helpText + '\n```\n';

    const fileName = 'README.md';
    const helpStart = '<!-- help start -->';
    const helpEnd = '<!-- help end -->';
    let fileContent = await fs.readFile(fileName, 'utf8');
    fileContent = fileContent.replace(new RegExp(`${helpStart}(.|\n)*${helpEnd}`, 'm'), `${helpStart}\n${helpTextMd}\n${helpEnd}`);
    await fs.outputFile(fileName, fileContent);
  }

  static parseCommandLine<T extends { args: Array<{ name: string }>; new(...args: any): any}>(commandInstance: InstanceType<T>): CommandOptions<T> {
    return Parser.parse(commandInstance.argv, { context: commandInstance, ...commandInstance.ctor });
  }

  /**
   * Reconstruct the command line from already parsed options.
   * @param commandInstance When calling from the subclass of `Command`, just pass `this`
   * @param options already parsed options
   * @returns the command line string corresponding to the parsed options
   */
  static reconstructCommandLine<T extends { args: Array<{ name: string }>; new(...args: any): any}>(commandInstance: InstanceType<T>, options?: CommandOptions<T>): string {
    if (options === undefined) {
      options = OclifUtils.parseCommandLine(commandInstance);
    }
    const args = new Array<string>();
    args.push(commandInstance.config.bin);
    if (options.argv?.length > 0) {
      args.push(...options.argv.map(x => quoteIfNeeded(x)));
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

export const prependCliToExamples = OclifUtils.prependCliToExamples;
export const generateHelpText = OclifUtils.generateHelpText;
export const injectHelpTextIntoReadmeMd = OclifUtils.injectHelpTextIntoReadmeMd;
export const parseCommandLine = OclifUtils.parseCommandLine;
export const reconstructCommandLine = OclifUtils.reconstructCommandLine;

export type CommandFlags<T> = T extends Parser.Input<infer F> ? F : never
export type CommandArgNames<T> = T extends { name: infer A }[] ? A : never
export type CommandArgs<T extends { args: Array<{ name: string }> }> = {
  [x in CommandArgNames<T['args']>]: string;
}
export type CommandOptions<T extends { args: Array<{ name: string }> }> = Parser.Output<CommandFlags<T>, CommandArgs<T>>

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Those fields are evaluated only once within the function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object
 * @returns An CliConsole instance that uses console.log/info/warn/error.
 */
export const cliConsole = CliConsole.default;

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Those fields are evaluated only once within the function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param colourer              Supplier of the colouring function, such as chalk or colors or cli-color
 * @param debugColourFuncName   Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.
 * @param infoColourFuncName    Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.
 * @param warnColourFuncName    Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.
 * @param errorColourFuncName   Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object
 * @returns An CliConsole instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.
 */
export const cliConsoleWithColour = CliConsole.withColour;
