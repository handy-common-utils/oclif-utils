# @handy-common-utils/oclif-utils

oclif (https://oclif.io/) related utilities

## How to use

First add it as a dependency:

```sh
npm install @handy-common-utils/oclif-utils
```

Then you can use it in the code:

```javascript
import { OclifUtils } from '@handy-common-utils/promise-utils';

protected async init() {
  OclifUtils.prependCliToExamples(this);
  return super.init();
}
```

You can either import and use the [class](#classes) as shown above,
or you can import individual [functions](#variables) directly like below:

```javascript
import { prependCliToExamples } from '@handy-common-utils/promise-utils';
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
* [prependCliToExamples](#prependclitoexamples)

#### Functions

* [getCommandConfig](#getcommandconfig)

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

#### prependCliToExamples

• `Const` **prependCliToExamples**: [prependCliToExamples](#prependclitoexamples) = OclifUtils.prependCliToExamples

### Functions

#### getCommandConfig

▸ **getCommandConfig**(`commandInstance`: Command): Command

##### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |

**Returns:** Command

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
* [prependCliToExamples](#prependclitoexamples)

#### Methods

##### generateHelpText

▸ `Static` **generateHelpText**(`commandInstance`: Command, `opts?`: Partial\<HelpOptions>): string

Generate formatted text content of help to a command

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`commandInstance` | Command | instance of the Command |
`opts?` | Partial\<HelpOptions> | format options |

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

▸ `Static` **injectHelpTextIntoReadmeMd**(`commandInstance`: Command, `opts?`: Partial\<HelpOptions>): Promise\<void>

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |
`opts?` | Partial\<HelpOptions> |

**Returns:** Promise\<void>

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

\+ **new SingleCommandHelp**(`commandInstance`: Command, `opts?`: Partial\<HelpOptions>): [SingleCommandHelp](#classessinglecommandhelpmd)

*Overrides void*

###### Parameters:

Name | Type |
------ | ------ |
`commandInstance` | Command |
`opts?` | Partial\<HelpOptions> |

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
