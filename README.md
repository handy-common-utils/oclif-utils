# @handy-common-utils/oclif-utils

oclif (https://oclif.io/) related utilities

[![Version](https://img.shields.io/npm/v/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![CI](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/oclif-utils/branch/master/graph/badge.svg?token=YIN8N3FJBR)](https://codecov.io/gh/handy-common-utils/oclif-utils)

## Features

With this utility library, you will be able to:

- Convenient `CommandOptions<typeof YourCommand>` type for referring to the return type of `await this.parse(YourCommand)`
- Update README.md file by `./bin/run --update-readme.md` for inserting properly formatted CLI manual information
- Reconstruct the full command line as a string

## How to use

If you are using latest versions of
[@oclif/core](https://github.com/oclif/core)([introduction](https://oclif.io/blog/2021/03/01/introducing-oclif-core), [migration](https://github.com/oclif/core/blob/main/MIGRATION.md)), 
just add latest version of this package as dependency:

```sh
npm install @handy-common-utils/oclif-utils@latest
```

Otherwise if the versions of oclif components you are using are older (@oclif/core@1.9.0, @oclif/plugin-plugins@2.1.0, @oclif/plugin-help@5.1.12, oclif@3.0.1),
you need to use version `1.1.3` of this package.
Or if you are using really old versions of oclif components (that means you are still using @oclif/config, @oclif/command, @oclif/parser), you need to use version `1.0.9` of this package.



Then you can use it in the code:

```javascript
import { Command, Flags } from '@oclif/core';
import { OclifUtils, cliConsole, cliConsoleWithColour } from '@handy-common-utils/oclif-utils';

class AwsServerlessDataflow extends Command {
  // You can use "typeof AwsServerlessDataflow.Options" in other places to refer to the type, if you want this convenience
  static Options: CommandOptions<typeof AwsServerlessDataflow>

  // ... other code ...

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: { ...Flags.help({ char: 'h' }), parse: async (_: any, cmd: Command) => {
      cmd.log(await OclifUtils.generateHelpText(cmd));
      cmd.exit(0);
    } },
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
    debug: Flags.boolean({ char: 'd', name: 'debug' }),
    // ... other code ...
  }

  static args = [
    { name: 'path' as const, default: 'dataflow', description: 'path for putting generated website files' },
    //             ^----- this is needed for the "path" property of options.args to be known to the compiler
  ];

  static examples = [
    '^ -r ap-southeast-2 -s',
    `^ -r ap-southeast-2 -s -i '*boi*' -i '*datahub*' \\
      -x '*jameshu*' -c`,
    `^ -r ap-southeast-2 -s -i '*lr-*' \\
      -i '*lead*' -x '*slack*' -x '*lead-prioritization*' \\
      -x '*lead-scor*' -x '*LeadCapture*' -c`,
  ];

  protected async init(): Promise<any> {
    OclifUtils.prependCliToExamples(this);  // "^" at the beginning of the examples will be replaced by the actual command
    return super.init();
  }

  async run(): Promise<void> {
    const options = await this.parse() as CommandOptions<typeof AwsServerlessDataflow>; // as typeof AwsServerlessDataflow.Options
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this); // you need to have <!-- help start -->...<!-- help end --> in your README.md
      return;
    }
    // This would be helpful if a complex command line needs to be shared
    if (options.flags.debug) {
      cliConsoleWithColour.info(`Command line: ${OclifUtils.reconstructCommandLine(this, options)}`);
    }

    // Now the compiler knows that options.args has a property named "path"
    cliConsole.log(options.args.path);

    // You can add this in the scripts section of your package.json:  "preversion": "./bin/run --update-readme.md && git add README.md"

    // ... other code ...
  }
}
export = AwsServerlessDataflow
```

You can either import and use the [class](#classes) as shown above,
or you can import individual [functions](#variables) directly like below:

```javascript
import { prependCliToExamples } from '@handy-common-utils/oclif-utils';
```

# API

<!-- API start -->
<a name="readmemd"></a>

## Module: oclif-utils

### Classes

- [OclifUtils](#classesoclif_utilsoclifutilsmd)

### Type aliases

#### CommandOptions

Ƭ **CommandOptions**<`T`\>: `Interfaces.ParserOutput`<`CommandFlags`<`T`\>, `CommandArgs`<`T`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

### Functions

#### generateHelpText

▸ **generateHelpText**(`commandInstance`, `options?`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `HelpOptions` |

##### Returns

`Promise`<`string`\>

___

#### getCommandConfig

▸ **getCommandConfig**(`commandInstance`): `Promise`<`Command`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

##### Returns

`Promise`<`Command`\>

___

#### injectHelpTextIntoReadmeMd

▸ **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `HelpOptions` |

##### Returns

`Promise`<`void`\>

___

#### prependCliToExamples

▸ **prependCliToExamples**(`commandInstance`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

##### Returns

`void`

___

#### reconstructCommandLine

▸ **reconstructCommandLine**<`T`\>(`commandInstance`, `options`): `string`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> |
| `options` | [`CommandOptions`](#commandoptions)<`T`\> |

##### Returns

`string`

## Classes


<a name="classesoclif_utilsoclifutilsmd"></a>

### Class: OclifUtils

[oclif-utils](#readmemd).OclifUtils

#### Constructors

##### constructor

• **new OclifUtils**()

#### Methods

##### generateHelpText

▸ `Static` **generateHelpText**(`commandInstance`, `options?`): `Promise`<`string`\>

Generate formatted text content of help to a command

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandInstance` | `default` | instance of the Command |
| `options?` | `HelpOptions` | format options |

###### Returns

`Promise`<`string`\>

help content

___

##### getCommandConfig

▸ `Static` **getCommandConfig**(`commandInstance`): `Promise`<`Command`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

###### Returns

`Promise`<`Command`\>

___

##### injectHelpTextIntoReadmeMd

▸ `Static` **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `HelpOptions` |

###### Returns

`Promise`<`void`\>

___

##### prependCliToExamples

▸ `Static` **prependCliToExamples**(`commandInstance`): `void`

Use this function to prepend command line to examples,
so that we don't have to hard code command name in the examples.
This function needs to be called from `init()` function of the Command.

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandInstance` | `default` | instance of the Command |

###### Returns

`void`

void

___

##### reconstructCommandLine

▸ `Static` **reconstructCommandLine**<`T`\>(`commandInstance`, `options`): `string`

Reconstruct the command line from already parsed options.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> | When calling from the subclass of `Command`, just pass `this` |
| `options` | [`CommandOptions`](#commandoptions)<`T`\> | Already parsed options. It can be got with `const options = await OclifUtils.parseCommandLine(commandInstance);` |

###### Returns

`string`

the command line string corresponding to the parsed options
<!-- API end -->
