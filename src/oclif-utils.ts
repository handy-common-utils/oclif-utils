import * as fs from 'fs-extra';
import * as Config from '@oclif/config';
import { Command } from '@oclif/command';
import { HelpOptions, Help } from '@oclif/plugin-help';
import * as Parser from '@oclif/parser';

export function getCommandConfig(commandInstance: Command): Config.Command {
  const cmd = Config.Command.toCached(commandInstance.ctor as any as Config.Command.Class);
  if (cmd.id == null) {
    cmd.id = '';
  }
  return cmd;
}

class SingleCommandHelp extends Help {
  constructor(protected commandInstance: Command, opts?: Partial<HelpOptions>) {
    super(commandInstance.config, opts);
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

export class OclifUtils {
  public static getCommandConfig(commandInstance: Command): Config.Command {
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
      cmd.examples = cmd.examples.map(str => str.startsWith('^ ') ? str.replace(/\^/g, commandInstance.config.bin) : str);
    }
  }

  /**
   * Generate formatted text content of help to a command
   * @param commandInstance instance of the Command
   * @param opts format options
   * @return help content
   */
  static generateHelpText(commandInstance: Command, opts?: Partial<HelpOptions>): string {
    const help = new SingleCommandHelp(commandInstance, {
      stripAnsi: true,
      maxWidth: 80,
      ...opts,
    });
    return help.generateHelpText();
  }

  static async injectHelpTextIntoReadmeMd(commandInstance: Command, opts?: Partial<HelpOptions>) {
    const helpText = OclifUtils.generateHelpText(commandInstance, {
      stripAnsi: true,
      maxWidth: 80,
      ...opts,
    });
    const helpTextMd = '```\n' + helpText + '\n```\n';

    const fileName = 'README.md';
    const helpStart = '<!-- help start -->';
    const helpEnd = '<!-- help end -->';
    let fileContent = await fs.readFile(fileName, 'utf8');
    fileContent = fileContent.replace(new RegExp(`${helpStart}(.|\n)*${helpEnd}`, 'm'), `${helpStart}\n${helpTextMd}\n${helpEnd}`);
    await fs.outputFile(fileName, fileContent);
  }
}

export const prependCliToExamples = OclifUtils.prependCliToExamples;
export const generateHelpText = OclifUtils.generateHelpText;
export const injectHelpTextIntoReadmeMd = OclifUtils.injectHelpTextIntoReadmeMd;

export type CommandFlags<T> = T extends Parser.Input<infer F> ? F : never
export type CommandArgNames<T> = T extends { name: infer A }[] ? A : never
export type CommandArgs<T extends { args: Array<{ name: string }> }> = {
  [x in CommandArgNames<T['args']>]: string;
}
export type CommandOptions<T extends { args: Array<{ name: string }> }> = Parser.Output<CommandFlags<T>, CommandArgs<T>>
