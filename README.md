# @handy-common-utils/oclif-utils

oclif (https://oclif.io/) related utilities

## Features

With this utility library, you will be able to:

* Make type information of `options.args` available
* Update README.md file by `./bin/run --update-readme.md` for inserting properly formated CLI manual information
* Prepend command line name to the examples
* Reconstruct the full command line as a string

## How to use

First add it as a dependency:

```sh
npm install @handy-common-utils/oclif-utils
```

Then you can use it in the code:

```javascript
import { Command, flags } from '@oclif/command';
import { CommandArgs, CommandFlags, CommandOptions, OclifUtils } from '@handy-common-utils/oclif-utils';

class AwsServerlessDataflow extends Command {
  // You can use "typeof AwsServerlessDataflow.Options" in other places to refer to the type
  static Options: CommandOptions<typeof AwsServerlessDataflow>

  // ... other code ...

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    'update-readme.md': flags.boolean({ hidden: true, description: 'For developers only, don\'t use' }),
    debug: flags.boolean({ char: 'd', name: 'debug' }),
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

  async run(argv?: string[]): Promise<void> {
    const options = this.parse<CommandFlags<typeof AwsServerlessDataflow>, CommandArgs<typeof AwsServerlessDataflow>>(AwsServerlessDataflow, argv);
    if (options.flags['update-readme.md']) {
      OclifUtils.injectHelpTextIntoReadmeMd(this); // you need to have <!-- help start -->...<!-- help end --> in your README.md
      return;
    }
    // This would be helpful if a complex command line needs to be shared
    if (options.flags.debug) {
      console.log(`Command line: ${OclifUtils.reconstructCommandLine(this, options)}`);
    }

    // Now the compiler knows that options.args has a property named "path"
    console.log(options.args.path);

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

@handy-common-utils/oclif-utils

## @handy-common-utils/oclif-utils

### Table of contents

#### Classes

- [OclifUtils](#classesoclifutilsmd)

#### Interfaces

- [OclifHelpContent](#interfacesoclifhelpcontentmd)

#### Type aliases

- [CommandArgNames](#commandargnames)
- [CommandArgs](#commandargs)
- [CommandFlags](#commandflags)
- [CommandOptions](#commandoptions)

#### Functions

- [generateHelpText](#generatehelptext)
- [getCommandConfig](#getcommandconfig)
- [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)
- [parseCommandLine](#parsecommandline)
- [prependCliToExamples](#prependclitoexamples)
- [reconstructCommandLine](#reconstructcommandline)

### Type aliases

#### CommandArgNames

Ƭ **CommandArgNames**<`T`\>: `T` extends { `name`: infer A  }[] ? `A` : `never`

##### Type parameters

| Name |
| :------ |
| `T` |

___

#### CommandArgs

Ƭ **CommandArgs**<`T`\>: { [x in CommandArgNames<T["args"]\>]: string}

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

___

#### CommandFlags

Ƭ **CommandFlags**<`T`\>: `T` extends `Parser.Input`<infer F\> ? `F` : `never`

##### Type parameters

| Name |
| :------ |
| `T` |

___

#### CommandOptions

Ƭ **CommandOptions**<`T`\>: `Parser.Output`<[`CommandFlags`](#commandflags)<`T`\>, [`CommandArgs`](#commandargs)<`T`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

### Functions

#### generateHelpText

▸ `Const` **generateHelpText**(`commandInstance`, `options?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

##### Returns

`string`

___

#### getCommandConfig

▸ **getCommandConfig**(`commandInstance`): `Config.Command`

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `Command` |

##### Returns

`Config.Command`

___

#### injectHelpTextIntoReadmeMd

▸ `Const` **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

##### Returns

`Promise`<`void`\>

___

#### parseCommandLine

▸ `Const` **parseCommandLine**<`T`\>(`commandInstance`): [`CommandOptions`](#commandoptions)<`T`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> |

##### Returns

[`CommandOptions`](#commandoptions)<`T`\>

___

#### prependCliToExamples

▸ `Const` **prependCliToExamples**(`commandInstance`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

##### Returns

`void`

___

#### reconstructCommandLine

▸ `Const` **reconstructCommandLine**<`T`\>(`commandInstance`, `options?`): `string`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> |
| `options?` | [`CommandOptions`](#commandoptions)<`T`\> |

##### Returns

`string`

## Classes


<a name="classesoclifutilsmd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / OclifUtils

### Class: OclifUtils

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Methods

- [generateHelpText](#generatehelptext)
- [getCommandConfig](#getcommandconfig)
- [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)
- [parseCommandLine](#parsecommandline)
- [prependCliToExamples](#prependclitoexamples)
- [reconstructCommandLine](#reconstructcommandline)

#### Constructors

##### constructor

• **new OclifUtils**()

#### Methods

##### generateHelpText

▸ `Static` **generateHelpText**(`commandInstance`, `options?`): `string`

Generate formatted text content of help to a command

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandInstance` | `default` | instance of the Command |
| `options?` | `Partial`<`HelpOptions`\> | format options |

###### Returns

`string`

help content

___

##### getCommandConfig

▸ `Static` **getCommandConfig**(`commandInstance`): `Command`

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

###### Returns

`Command`

___

##### injectHelpTextIntoReadmeMd

▸ `Static` **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

###### Returns

`Promise`<`void`\>

___

##### parseCommandLine

▸ `Static` **parseCommandLine**<`T`\>(`commandInstance`): [`CommandOptions`](#commandoptions)<`T`\>

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> |

###### Returns

[`CommandOptions`](#commandoptions)<`T`\>

___

##### prependCliToExamples

▸ `Static` **prependCliToExamples**(`commandInstance`): `void`

Use this function to prepend command line to examples.
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

▸ `Static` **reconstructCommandLine**<`T`\>(`commandInstance`, `options?`): `string`

Reconstruct the command line from already parsed options.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> | When calling from the subclass of `Command`, just pass `this` |
| `options?` | [`CommandOptions`](#commandoptions)<`T`\> | already parsed options |

###### Returns

`string`

the command line string corresponding to the parsed options

## Interfaces


<a name="interfacesoclifhelpcontentmd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / OclifHelpContent

### Interface: OclifHelpContent

#### Table of contents

##### Properties

- [aliases](#aliases)
- [args](#args)
- [description](#description)
- [examples](#examples)
- [flags](#flags)
- [usage](#usage)

#### Properties

##### aliases

• `Optional` **aliases**: `string`

___

##### args

• `Optional` **args**: `string`

___

##### description

• `Optional` **description**: `string`

___

##### examples

• `Optional` **examples**: `string`

___

##### flags

• `Optional` **flags**: `string`

___

##### usage

• `Optional` **usage**: `string`
<!-- API end -->
