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

#### Modules

- [cli-console](#modulescli_consolemd)
- [oclif-utils](#modulesoclif_utilsmd)

## Classes


<a name="classescli_consolecliconsolemd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / [cli-console](#modulescli_consolemd) / CliConsole

### Class: CliConsole<DEBUG_FUNC, INFO_FUNC, WARN_FUNC, ERROR_FUNC\>

[cli-console](#modulescli_consolemd).CliConsole

Encapsulation of console output functions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [debug](#debug)
- [error](#error)
- [info](#info)
- [isDebug](#isdebug)
- [isQuiet](#isquiet)
- [warn](#warn)
- [NO\_OP\_FUNC](#no_op_func)

##### Methods

- [default](#default)
- [withColour](#withcolour)

#### Constructors

##### constructor

• **new CliConsole**<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>(`debugFunction`, `infoFunction`, `warnFunction`, `errorFunction`, `isDebug?`, `isQuiet?`)

Constructor

###### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `debugFunction` | `DEBUG_FUNC` | `undefined` | function for outputting debug information |
| `infoFunction` | `INFO_FUNC` | `undefined` | function for outputting info information |
| `warnFunction` | `WARN_FUNC` | `undefined` | function for outputting warn information |
| `errorFunction` | `ERROR_FUNC` | `undefined` | function for outputting error information |
| `isDebug` | `boolean` | `false` | is debug output enabled or not |
| `isQuiet` | `boolean` | `false` | is quiet mode enabled or not. When quiet mode is enabled, debug and info output would be discarded. |

#### Properties

##### debug

• **debug**: `DEBUG_FUNC`

___

##### error

• **error**: `ERROR_FUNC`

___

##### info

• **info**: `INFO_FUNC`

___

##### isDebug

• **isDebug**: `boolean` = `false`

___

##### isQuiet

• **isQuiet**: `boolean` = `false`

___

##### warn

• **warn**: `WARN_FUNC`

___

##### NO\_OP\_FUNC

▪ `Static` `Protected` **NO\_OP\_FUNC**: () => `void`

###### Type declaration

▸ (): `void`

####### Returns

`void`

#### Methods

##### default

▸ `Static` **default**<`FLAGS`\>(`flags`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

Build an instance with console.log/info/warn/error.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Those fields are evaluated only once within the function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

An instance that uses console.log/info/warn/error.

___

##### withColour

▸ `Static` **withColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

Build an instance with console.log/info/warn/error and chalk/colors/cli-color.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |
| `COLOURER` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Those fields are evaluated only once within the function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.


<a name="classesoclif_utilsoclifutilsmd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / [oclif-utils](#modulesoclif_utilsmd) / OclifUtils

### Class: OclifUtils

[oclif-utils](#modulesoclif_utilsmd).OclifUtils

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


<a name="interfacesoclif_utilsoclifhelpcontentmd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / [oclif-utils](#modulesoclif_utilsmd) / OclifHelpContent

### Interface: OclifHelpContent

[oclif-utils](#modulesoclif_utilsmd).OclifHelpContent

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

## Modules


<a name="modulescli_consolemd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / cli-console

### Module: cli-console

#### Table of contents

##### Classes

- [CliConsole](#classescli_consolecliconsolemd)

##### Type aliases

- [DefaultCliConsole](#defaultcliconsole)

#### Type aliases

##### DefaultCliConsole

Ƭ **DefaultCliConsole**: `ReturnType`<typeof [`default`](#default)\>


<a name="modulesoclif_utilsmd"></a>

[@handy-common-utils/oclif-utils](#readmemd) / oclif-utils

### Module: oclif-utils

#### Table of contents

##### Classes

- [OclifUtils](#classesoclif_utilsoclifutilsmd)

##### Interfaces

- [OclifHelpContent](#interfacesoclif_utilsoclifhelpcontentmd)

##### Type aliases

- [CommandArgNames](#commandargnames)
- [CommandArgs](#commandargs)
- [CommandFlags](#commandflags)
- [CommandOptions](#commandoptions)

##### Functions

- [cliConsole](#cliconsole)
- [cliConsoleWithColour](#cliconsolewithcolour)
- [generateHelpText](#generatehelptext)
- [getCommandConfig](#getcommandconfig)
- [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)
- [parseCommandLine](#parsecommandline)
- [prependCliToExamples](#prependclitoexamples)
- [reconstructCommandLine](#reconstructcommandline)

#### Type aliases

##### CommandArgNames

Ƭ **CommandArgNames**<`T`\>: `T` extends { `name`: infer A  }[] ? `A` : `never`

###### Type parameters

| Name |
| :------ |
| `T` |

___

##### CommandArgs

Ƭ **CommandArgs**<`T`\>: { [x in CommandArgNames<T["args"]\>]: string}

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

___

##### CommandFlags

Ƭ **CommandFlags**<`T`\>: `T` extends `Parser.Input`<infer F\> ? `F` : `never`

###### Type parameters

| Name |
| :------ |
| `T` |

___

##### CommandOptions

Ƭ **CommandOptions**<`T`\>: `Parser.Output`<[`CommandFlags`](#commandflags)<`T`\>, [`CommandArgs`](#commandargs)<`T`\>\>

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Functions

##### cliConsole

▸ `Const` **cliConsole**<`FLAGS`\>(`flags`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

Build an encapsulation of console output functions with console.log/info/warn/error.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Those fields are evaluated only once within the function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

An CliConsole instance that uses console.log/info/warn/error.

___

##### cliConsoleWithColour

▸ `Const` **cliConsoleWithColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |
| `COLOURER` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Those fields are evaluated only once within the function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

An CliConsole instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.

___

##### generateHelpText

▸ `Const` **generateHelpText**(`commandInstance`, `options?`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

###### Returns

`string`

___

##### getCommandConfig

▸ **getCommandConfig**(`commandInstance`): `Config.Command`

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `Command` |

###### Returns

`Config.Command`

___

##### injectHelpTextIntoReadmeMd

▸ `Const` **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

###### Returns

`Promise`<`void`\>

___

##### parseCommandLine

▸ `Const` **parseCommandLine**<`T`\>(`commandInstance`): [`CommandOptions`](#commandoptions)<`T`\>

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

▸ `Const` **prependCliToExamples**(`commandInstance`): `void`

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

###### Returns

`void`

___

##### reconstructCommandLine

▸ `Const` **reconstructCommandLine**<`T`\>(`commandInstance`, `options?`): `string`

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `InstanceType`<`T`\> |
| `options?` | [`CommandOptions`](#commandoptions)<`T`\> |

###### Returns

`string`
<!-- API end -->
