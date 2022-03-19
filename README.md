# @handy-common-utils/oclif-utils

oclif (https://oclif.io/) related utilities

[![Version](https://img.shields.io/npm/v/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![CI](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/oclif-utils/branch/master/graph/badge.svg?token=YIN8N3FJBR)](https://codecov.io/gh/handy-common-utils/oclif-utils)

## Features

With this utility library, you will be able to:

* Make type information of `options.args` available
* Update README.md file by `./bin/run --update-readme.md` for inserting properly formated CLI manual information
* Prepend command line name to the examples
* Reconstruct the full command line as a string
* Handy `CliConsole` for logging with and without colouring

## How to use

If you are using latest versions of oclif components ("@oclif/command": "^1.8.16", "@oclif/config": "^1.18.3", "@oclif/plugin-help": "^5.1.12"), 
just add latest version of this package as dependency:

```sh
npm install @handy-common-utils/oclif-utils@latest
```

Otherwise if the versions of oclif components you are using are older,
you need to use the older version of this package:

```sh
npm install @handy-common-utils/oclif-utils@1.0.9
```


Then you can use it in the code:

```javascript
import { Command, flags } from '@oclif/command';
import { OclifUtils, cliConsole, cliConsoleWithColour } from '@handy-common-utils/oclif-utils';

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

  async run(): Promise<void> {
    const options = OclifUtils.parseCommandLine<typeof AwsServerlessDataflow>(this);
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

## @handy-common-utils/oclif-utils

### Modules

- [cli-console](#modulescli_consolemd)
- [index](#modulesindexmd)
- [oclif-utils](#modulesoclif_utilsmd)

## Classes


<a name="classescli_consolecliconsolemd"></a>

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

| Property | Description |
| --- | --- |
| • **debug**: `DEBUG_FUNC` |  |
| • **error**: `ERROR_FUNC` |  |
| • **info**: `INFO_FUNC` |  |
| • **isDebug**: `boolean` = `false` |  |
| • **isQuiet**: `boolean` = `false` |  |
| • **warn**: `WARN_FUNC` |  |
| ▪ `Static` `Protected` **NO\_OP\_FUNC**: () => `void` | **Type declaration:**<br>▸ (): `void`<br><br>**Returns:**<br>`void` |


#### Methods

##### default

▸ `Static` **default**<`FLAGS`\>(`flags`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

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

[`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An instance that uses console.log/info/warn/error.

___

##### withColour

▸ `Static` **withColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

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

[`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.


<a name="classesoclif_utilsoclifutilsmd"></a>

### Class: OclifUtils

[oclif-utils](#modulesoclif_utilsmd).OclifUtils

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

### Interface: OclifHelpContent

[oclif-utils](#modulesoclif_utilsmd).OclifHelpContent

#### Properties

| Property | Description |
| --- | --- |
| • `Optional` **aliases**: `string` |  |
| • `Optional` **args**: `string` |  |
| • `Optional` **description**: `string` |  |
| • `Optional` **examples**: `string` |  |
| • `Optional` **flags**: `string` |  |
| • `Optional` **usage**: `string` | ## Modules<br><br><br><a name="modulescli_consolemd"></a><br><br>### Module: cli-console |


#### Classes

- [CliConsole](#classescli_consolecliconsolemd)

#### Type aliases

##### DefaultCliConsole

Ƭ **DefaultCliConsole**: `ReturnType`<typeof [`default`](#default)\>

CliConsole that has function signatures based on console.log/info/warn/error.

#### Functions

##### cliConsole

▸ **cliConsole**<`FLAGS`\>(`flags`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

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

[`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An CliConsole instance that uses console.log/info/warn/error.

___

##### cliConsoleWithColour

▸ **cliConsoleWithColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

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

[`CliConsole`](#classescli_consolecliconsolemd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An CliConsole instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.


<a name="modulesindexmd"></a>

### Module: index

#### References

##### CliConsole

Re-exports [CliConsole](#classescli_consolecliconsolemd)

___

##### CommandArgNames

Re-exports [CommandArgNames](#commandargnames)

___

##### CommandArgs

Re-exports [CommandArgs](#commandargs)

___

##### CommandFlags

Re-exports [CommandFlags](#commandflags)

___

##### CommandOptions

Re-exports [CommandOptions](#commandoptions)

___

##### DefaultCliConsole

Re-exports [DefaultCliConsole](#defaultcliconsole)

___

##### Flags

Re-exports [Flags](#flags)

___

##### OclifHelpContent

Re-exports [OclifHelpContent](#interfacesoclif_utilsoclifhelpcontentmd)

___

##### OclifUtils

Re-exports [OclifUtils](#classesoclif_utilsoclifutilsmd)

___

##### cliConsole

Re-exports [cliConsole](#cliconsole)

___

##### cliConsoleWithColour

Re-exports [cliConsoleWithColour](#cliconsolewithcolour)

___

##### generateHelpText

Re-exports [generateHelpText](#generatehelptext)

___

##### getCommandConfig

Re-exports [getCommandConfig](#getcommandconfig)

___

##### injectHelpTextIntoReadmeMd

Re-exports [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)

___

##### parseCommandLine

Re-exports [parseCommandLine](#parsecommandline)

___

##### prependCliToExamples

Re-exports [prependCliToExamples](#prependclitoexamples)

___

##### reconstructCommandLine

Re-exports [reconstructCommandLine](#reconstructcommandline)


<a name="modulesoclif_utilsmd"></a>

### Module: oclif-utils

#### Classes

- [OclifUtils](#classesoclif_utilsoclifutilsmd)

#### Interfaces

- [OclifHelpContent](#interfacesoclif_utilsoclifhelpcontentmd)

#### Type aliases

##### CommandArgNames

Ƭ **CommandArgNames**<`T`\>: `T` extends { `name`: infer A  }[] ? `A` : `never`

###### Type parameters

| Name |
| :------ |
| `T` |

___

##### CommandArgs

Ƭ **CommandArgs**<`T`\>: { [x in CommandArgNames<T["args"]\>]: string }

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

___

##### Flags

Ƭ **Flags**<`T`\>: `T` extends `Parser.flags.Input`<infer F\> ? `F` : `never`

Get the flag object type from flags configuration type

###### Type parameters

| Name |
| :------ |
| `T` |

#### Functions

##### generateHelpText

▸ **generateHelpText**(`commandInstance`, `options?`): `string`

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
| `commandInstance` | `default` |

###### Returns

`Config.Command`

___

##### injectHelpTextIntoReadmeMd

▸ **injectHelpTextIntoReadmeMd**(`commandInstance`, `options?`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |
| `options?` | `Partial`<`HelpOptions`\> |

###### Returns

`Promise`<`void`\>

___

##### parseCommandLine

▸ **parseCommandLine**<`T`\>(`commandInstance`): [`CommandOptions`](#commandoptions)<`T`\>

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

▸ **prependCliToExamples**(`commandInstance`): `void`

###### Parameters

| Name | Type |
| :------ | :------ |
| `commandInstance` | `default` |

###### Returns

`void`

___

##### reconstructCommandLine

▸ **reconstructCommandLine**<`T`\>(`commandInstance`, `options?`): `string`

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
