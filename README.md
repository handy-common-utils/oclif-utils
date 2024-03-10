# @handy-common-utils/oclif-utils

oclif (https://oclif.io/) related utilities

[![Version](https://img.shields.io/npm/v/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/oclif-utils.svg)](https://npmjs.org/package/@handy-common-utils/oclif-utils)
[![CI](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/oclif-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/oclif-utils/branch/master/graph/badge.svg?token=YIN8N3FJBR)](https://codecov.io/gh/handy-common-utils/oclif-utils)

## Features

With this utility library, you will be able to:

- Print out pretty full help/usage information
- Reconstruct the full command line as a string
- Insert help/usage information into `README.md` file automatically

## Installation

This library has been verified to be working with
[@oclif/core](https://github.com/oclif/core) v2 and v3, 
you just need to add it as a dependency:

```sh
npm install @handy-common-utils/oclif-utils@latest
```

If the versions of oclif components you are using are older (For example, @oclif/core@1.9.0, @oclif/plugin-plugins@2.1.0, @oclif/plugin-help@5.1.12, oclif@3.0.1),
you need to use version `1.1.3` of this package.
Or if you are using really old versions of oclif components (that means you are still using @oclif/config, @oclif/command, @oclif/parser), you need to use version `1.0.9` of this package.

## Usage

### Print out full help/usage information

The function `withEnhancedFlagsHandled(...)` checks whether '-h' or '--help' is the only command line argument.
If that is the case, it will build the help information, print it out, then exit with exit code 0.
In such case, your command processing code after it won't get executed.

To use it, just need to add this as the first line in the `run()` function of your command class:

```javascript
const options = await withEnhancedFlagsHandled(this, () => this.parse(<Your command class name>));
```

And, the `--help`/`-h` flag needs to be defined, like this:

```javascript
static flags = {
  ...enhancedFlags,
  // your other flags
};
```

Below is a full example:

```typescript
import { Command, Flags } from '@oclif/core'
import { enhancedFlags, withEnhancedFlagsHandled } from '@handy-common-utils/oclif-utils';

class Hello extends Command {
  // Feel free to define description, examples, etc.
  // They will be printed out as part of the help/usage information.

  static flags = {
    ...enhancedFlags,
    // and other flags ...
  }

  // and args ...

  async run(): Promise<void> {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(Hello));

    // your command processing code ...
  }
}
```

### Reconstruct the full command line as a string

Sometimes it would be useful to record or print out the full command line.
The `reconstructCommandLine(...)` can return a string containing the full command line.

Below is an example:

```javascript
import { Command, Flags } from '@oclif/core'
import { reconstructCommandLine, withEnhancedFlagsHandled } from '@handy-common-utils/oclif-utils';

class Hello extends Command {
  // other code ...

  async run(): Promise<void> {
    const options = await withEnhancedFlagsHandled(this, () => this.parse(Hello));
    const fullCommandLine = reconstructCommandLine(this, options);

    // your command processing code ...
  }
}
```

### Insert help/usage information into `README.md`

In many occasions it would be handy if help/usage information can be inserted into `README.md` automatically.
This can be achieved in two steps.

__Step 1: Add `--update-readme.md` support in your command__

As long as `enhancedFlags` and `withEnhancedFlagsHandled(...)` are used, then `--update-readme.md` is supported automatically.
See the examples above for details.

__Step 2: Run `./bin/run --update-readme.md` as part of your workflow__

In your CI/CD workflow, you can just run your command with `--update-readme.md`, then the command will update `README.md` automatically.
You may want to commit the change to `README.md` after it is updated.

Below are example scripts in `package.json`:

```json
  "scripts": {
    "preversion": "./bin/run --update-readme.md && git add README.md"
  },
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
