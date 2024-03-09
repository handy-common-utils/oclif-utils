import {Args, Command, Flags} from '@oclif/core'
import { generateHelpText, reconstructCommandLine, withHelpHandled } from '../../../src'

class Hello extends Command {
  static description = 'Say hello'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    help: Flags.boolean({char: 'h'}),
    gen: Flags.boolean({char: 'g'}),
    from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  static args = {
    person: Args.string({description: 'Person to say hello to', required: true}),
  }

  async run(): Promise<void> {
    const options = await withHelpHandled(this, () => this.parse());

    const {args, flags} = options

    if (flags.gen) {
        console.log(reconstructCommandLine(this, options));
        return;
    }

    this.log(`Hello to ${args.person} from ${flags.from}!`);
  }
}

export = Hello;