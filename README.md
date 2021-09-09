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

**[@handy-common-utils/oclif-utils](#readmemd)**

> Globals

## @handy-common-utils/oclif-utils

### Index

#### Classes

* [OclifUtils](#classesoclifutilsmd)
* [SingleCommandHelp](#classessinglecommandhelpmd)

#### Interfaces

* [OclifHelpContent](#interfacesoclifhelpcontentmd)

#### Type aliases

* [CommandArgNames](#commandargnames)
* [CommandArgs](#commandargs)
* [CommandFlags](#commandflags)
* [CommandOptions](#commandoptions)

#### Variables

* [generateHelpText](#generatehelptext)
* [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)
* [parseCommandLine](#parsecommandline)
* [prependCliToExamples](#prependclitoexamples)
* [reconstructCommandLine](#reconstructcommandline)

#### Functions

* [getCommandConfig](#getcommandconfig)
* [quoteIfNeeded](#quoteifneeded)

### Type aliases

#### CommandArgNames

Ƭ  **CommandArgNames**\<T>: T *extends* { name: *infer* A  }[] ? A : never

##### Type parameters:

Name |
------ |
`T` |

___

#### CommandArgs

Ƭ  **CommandArgs**\<T>: {}

##### Type parameters:

Name | Type |
------ | ------ |
`T` | { args: Array\<{ name: string  }>  } |

___

#### CommandFlags

Ƭ  **CommandFlags**\<T>: T *extends* Parser.Input\<*infer* F> ? F : never

##### Type parameters:

Name |
------ |
`T` |

___

#### CommandOptions

Ƭ  **CommandOptions**\<T>: Parser.Output\<[CommandFlags](#commandflags)\<T>, [CommandArgs](#commandargs)\<T>>

##### Type parameters:

Name | Type |
------ | ------ |
`T` | { args: Array\<{ name: string  }>  } |

### Variables

#### generateHelpText

• `Const` **generateHelpText**: [generateHelpText](#generatehelptext) = OclifUtils.generateHelpText

___

#### injectHelpTextIntoReadmeMd

• `Const` **injectHelpTextIntoReadmeMd**: [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd) = OclifUtils.injectHelpTextIntoReadmeMd

___

#### parseCommandLine

• `Const` **parseCommandLine**: [parseCommandLine](#parsecommandline) = OclifUtils.parseCommandLine

___

#### prependCliToExamples

• `Const` **prependCliToExamples**: [prependCliToExamples](#prependclitoexamples) = OclifUtils.prependCliToExamples

___

#### reconstructCommandLine

• `Const` **reconstructCommandLine**: [reconstructCommandLine](#reconstructcommandline) = OclifUtils.reconstructCommandLine

### Functions

#### getCommandConfig

▸ **getCommandConfig**(`commandInstance`: Command): Command

##### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |

**Returns:** Command

___

#### quoteIfNeeded

▸ `Const`**quoteIfNeeded**(`text`: any): string

##### Parameters:

Name | Type |
------ | ------ |
`text` | any |

**Returns:** string

## Classes


<a name="classesoclifutilsmd"></a>

**[@handy-common-utils/oclif-utils](#readmemd)**

> [Globals](#readmemd) / OclifUtils

### Class: OclifUtils

#### Hierarchy

* **OclifUtils**

#### Index

##### Methods

* [generateHelpText](#generatehelptext)
* [getCommandConfig](#getcommandconfig)
* [injectHelpTextIntoReadmeMd](#injecthelptextintoreadmemd)
* [parseCommandLine](#parsecommandline)
* [prependCliToExamples](#prependclitoexamples)
* [reconstructCommandLine](#reconstructcommandline)

#### Methods

##### generateHelpText

▸ `Static` **generateHelpText**(`commandInstance`: Command, `options?`: Partial\<HelpOptions>): string

Generate formatted text content of help to a command

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`commandInstance` | Command | instance of the Command |
`options?` | Partial\<HelpOptions> | format options |

**Returns:** string

help content

___

##### getCommandConfig

▸ `Static` **getCommandConfig**(`commandInstance`: Command): Command

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |

**Returns:** Command

___

##### injectHelpTextIntoReadmeMd

▸ `Static` **injectHelpTextIntoReadmeMd**(`commandInstance`: Command, `options?`: Partial\<HelpOptions>): Promise\<void>

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |
`options?` | Partial\<HelpOptions> |

**Returns:** Promise\<void>

___

##### parseCommandLine

▸ `Static` **parseCommandLine**\<T>(`commandInstance`: InstanceType\<T>): [CommandOptions](#commandoptions)\<T>

###### Type parameters:

Name | Type |
------ | ------ |
`T` | { constructor: (...args: any) => any ; args: Array\<{ name: string  }>  } |

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | InstanceType\<T> |

**Returns:** [CommandOptions](#commandoptions)\<T>

___

##### prependCliToExamples

▸ `Static` **prependCliToExamples**(`commandInstance`: Command): void

Use this function to prepend command line to examples.
This function needs to be called from `init()` function of the Command.

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`commandInstance` | Command | instance of the Command |

**Returns:** void

void

___

##### reconstructCommandLine

▸ `Static` **reconstructCommandLine**\<T>(`commandInstance`: InstanceType\<T>, `options?`: [CommandOptions](#commandoptions)\<T>): string

Reconstruct the command line from already parsed options.

###### Type parameters:

Name | Type |
------ | ------ |
`T` | { constructor: (...args: any) => any ; args: Array\<{ name: string  }>  } |

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`commandInstance` | InstanceType\<T> | When calling from the subclass of `Command`, just pass `this` |
`options?` | [CommandOptions](#commandoptions)\<T> | already parsed options |

**Returns:** string

the command line string corresponding to the parsed options


<a name="classessinglecommandhelpmd"></a>

**[@handy-common-utils/oclif-utils](#readmemd)**

> [Globals](#readmemd) / SingleCommandHelp

### Class: SingleCommandHelp

#### Hierarchy

* Help

  ↳ **SingleCommandHelp**

#### Index

##### Constructors

* [constructor](#constructor)

##### Properties

* [commandInstance](#commandinstance)
* [config](#config)
* [opts](#opts)
* [render](#render)

##### Accessors

* [sortedCommands](#sortedcommands)
* [sortedTopics](#sortedtopics)

##### Methods

* [command](#command)
* [formatCommand](#formatcommand)
* [formatCommands](#formatcommands)
* [formatRoot](#formatroot)
* [formatTopic](#formattopic)
* [formatTopics](#formattopics)
* [generateHelpText](#generatehelptext)
* [showCommandHelp](#showcommandhelp)
* [showHelp](#showhelp)
* [showRootHelp](#showroothelp)
* [showTopicHelp](#showtopichelp)

#### Constructors

##### constructor

\+ **new SingleCommandHelp**(`commandInstance`: Command, `options?`: Partial\<HelpOptions>): [SingleCommandHelp](#classessinglecommandhelpmd)

*Overrides void*

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |
`options?` | Partial\<HelpOptions> |

**Returns:** [SingleCommandHelp](#classessinglecommandhelpmd)

#### Properties

##### commandInstance

• `Protected` **commandInstance**: Command

___

##### config

• `Protected` **config**: IConfig

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[config](#config)*

___

##### opts

• `Protected` **opts**: HelpOptions

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[opts](#opts)*

___

##### render

•  **render**: (input: string) => string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[render](#render)*

#### Accessors

##### sortedCommands

• `Protected`get **sortedCommands**(): Plugin[]

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[sortedCommands](#sortedcommands)*

**Returns:** Plugin[]

___

##### sortedTopics

• `Protected`get **sortedTopics**(): Topic[]

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[sortedTopics](#sortedtopics)*

**Returns:** Topic[]

#### Methods

##### command

▸ `Protected`**command**(`command`: Command): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[command](#command)*

**`deprecated`** used for readme generation

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`command` | Command | The command to generate readme help for |

**Returns:** string

the readme help string for the given command

___

##### formatCommand

▸ `Protected`**formatCommand**(`command`: Command): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[formatCommand](#formatcommand)*

###### Parameters:

Name | Type |
------ | ------ |
`command` | Command |

**Returns:** string

___

##### formatCommands

▸ `Protected`**formatCommands**(`commands`: Command[]): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[formatCommands](#formatcommands)*

###### Parameters:

Name | Type |
------ | ------ |
`commands` | Command[] |

**Returns:** string

___

##### formatRoot

▸ `Protected`**formatRoot**(): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[formatRoot](#formatroot)*

**Returns:** string

___

##### formatTopic

▸ `Protected`**formatTopic**(`topic`: Topic): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[formatTopic](#formattopic)*

###### Parameters:

Name | Type |
------ | ------ |
`topic` | Topic |

**Returns:** string

___

##### formatTopics

▸ `Protected`**formatTopics**(`topics`: Topic[]): string

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[formatTopics](#formattopics)*

###### Parameters:

Name | Type |
------ | ------ |
`topics` | Topic[] |

**Returns:** string

___

##### generateHelpText

▸ **generateHelpText**(): string

**Returns:** string

___

##### showCommandHelp

▸ **showCommandHelp**(`command`: Command): void

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[showCommandHelp](#showcommandhelp)*

*Overrides void*

###### Parameters:

Name | Type |
------ | ------ |
`command` | Command |

**Returns:** void

___

##### showHelp

▸ **showHelp**(`argv`: string[]): void

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[showHelp](#showhelp)*

*Overrides void*

###### Parameters:

Name | Type |
------ | ------ |
`argv` | string[] |

**Returns:** void

___

##### showRootHelp

▸ `Protected`**showRootHelp**(): void

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[showRootHelp](#showroothelp)*

**Returns:** void

___

##### showTopicHelp

▸ `Protected`**showTopicHelp**(`topic`: Topic): void

*Inherited from [SingleCommandHelp](#classessinglecommandhelpmd).[showTopicHelp](#showtopichelp)*

###### Parameters:

Name | Type |
------ | ------ |
`topic` | Topic |

**Returns:** void

## Interfaces


<a name="interfacesoclifhelpcontentmd"></a>

**[@handy-common-utils/oclif-utils](#readmemd)**

> [Globals](#readmemd) / OclifHelpContent

### Interface: OclifHelpContent

#### Hierarchy

* **OclifHelpContent**

#### Index

##### Properties

* [aliases](#aliases)
* [args](#args)
* [description](#description)
* [examples](#examples)
* [flags](#flags)
* [usage](#usage)

#### Properties

##### aliases

• `Optional` **aliases**: undefined \| string

___

##### args

• `Optional` **args**: undefined \| string

___

##### description

• `Optional` **description**: undefined \| string

___

##### examples

• `Optional` **examples**: undefined \| string

___

##### flags

• `Optional` **flags**: undefined \| string

___

##### usage

• `Optional` **usage**: undefined \| string
<!-- API end -->
