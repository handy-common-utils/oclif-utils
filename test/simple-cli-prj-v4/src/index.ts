import {Args, Command, Flags} from '@oclif/core'
import { enhancedFlags, reconstructCommandLine, withEnhancedFlagsHandled } from '../../../src'

class Hello extends Command {
  static id = ' '; // workaround for the correct USAGE section in help output
  static description = 'Say hello'

  static examples = [
    `$ <%= config.bin %> hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    ...enhancedFlags,
    gen: Flags.boolean({char: 'g'}),
    from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  static args = {
    person: Args.string({description: 'Person to say hello to', required: true}),
  }

  async run(): Promise<void> {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(Hello));

    const {args, flags} = options

    if (flags.gen) {
        console.log(reconstructCommandLine(this, options));
        return;
    }

    this.log(`Hello to ${args.person} from ${flags.from}!`);
  }
}

export = Hello;