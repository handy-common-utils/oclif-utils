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

**[@handy-common-utils/aws-utils](#readmemd)**

> Globals

## @handy-common-utils/aws-utils

### Index

#### Classes

* [AwsUtils](#classesawsutilsmd)

#### Variables

* [parseArn](#parsearn)
* [repeatFetchingItemsByMarker](#repeatfetchingitemsbymarker)
* [repeatFetchingItemsByNextToken](#repeatfetchingitemsbynexttoken)
* [repeatFetchingItemsByPosition](#repeatfetchingitemsbyposition)

### Variables

#### parseArn

• `Const` **parseArn**: [parseArn](#parsearn) = AwsUtils.parseArn

___

#### repeatFetchingItemsByMarker

• `Const` **repeatFetchingItemsByMarker**: [repeatFetchingItemsByMarker](#repeatfetchingitemsbymarker) = AwsUtils.repeatFetchingItemsByMarker

___

#### repeatFetchingItemsByNextToken

• `Const` **repeatFetchingItemsByNextToken**: [repeatFetchingItemsByNextToken](#repeatfetchingitemsbynexttoken) = AwsUtils.repeatFetchingItemsByNextToken

___

#### repeatFetchingItemsByPosition

• `Const` **repeatFetchingItemsByPosition**: [repeatFetchingItemsByPosition](#repeatfetchingitemsbyposition) = AwsUtils.repeatFetchingItemsByPosition

## Classes


<a name="classesawsutilsmd"></a>

**[@handy-common-utils/aws-utils](#readmemd)**

> [Globals](#readmemd) / AwsUtils

### Class: AwsUtils

#### Hierarchy

* **AwsUtils**

#### Index

##### Methods

* [parseArn](#parsearn)
* [repeatFetchingItemsByMarker](#repeatfetchingitemsbymarker)
* [repeatFetchingItemsByNextToken](#repeatfetchingitemsbynexttoken)
* [repeatFetchingItemsByPosition](#repeatfetchingitemsbyposition)

#### Methods

##### parseArn

▸ `Static` **parseArn**(`arn`: string \| null \| undefined): ReturnType\<*typeof* simpleParseArn> & { arn: string  } \| null \| undefined

Parse ARN

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`arn` | string \| null \| undefined | the ARN string that could be null or undefined |

**Returns:** ReturnType\<*typeof* simpleParseArn> & { arn: string  } \| null \| undefined

null or undeinfed if the input is null or undefined, or parsed ARN including the original ARN string

___

##### repeatFetchingItemsByMarker

▸ `Static` **repeatFetchingItemsByMarker**\<T>(`itemsFieldName`: string, `fetchItemsByMarker`: (parameter: { Marker?: undefined \| string  }) => Promise\<{ NextMarker?: undefined \| string  }>): Promise\<T[]>

Fetch items by Marker repeatedly.
This function is useful for client side pagination when the response from AWS API contains NextMarker fields.

**`example`**
```javascript
 
const topics = await AwsUtils.repeatFetchingItemsByNextToken<SNS.Topic>('Topics',
  pagingParam => sns.listTopics({...pagingParam}).promise(),
);

```
###### Type parameters:

Name | Description |
------ | ------ |
`T` | type of the items returned by AWS API  |

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`itemsFieldName` | string | name of the field containing returned items in AWS API response |
`fetchItemsByMarker` | (parameter: { Marker?: undefined \| string  }) => Promise\<{ NextMarker?: undefined \| string  }> | the function for fetching items by Marker |

**Returns:** Promise\<T[]>

all items fetched

___

##### repeatFetchingItemsByNextToken

▸ `Static` **repeatFetchingItemsByNextToken**\<T>(`itemsFieldName`: string, `fetchItemsByNextToken`: (parameter: { NextToken?: undefined \| string  }) => Promise\<{ NextToken?: undefined \| string  }>): Promise\<T[]>

Fetch items by NextToken repeatedly.
This function is useful for client side pagination when the response from AWS API contains NextToken fields.

**`example`**
```javascript
 
const topics = await AwsUtils.repeatFetchingItemsByNextToken<SNS.Topic>('Topics',
  pagingParam => sns.listTopics({...pagingParam}).promise(),
);

```
###### Type parameters:

Name | Description |
------ | ------ |
`T` | type of the items returned by AWS API  |

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`itemsFieldName` | string | name of the field containing returned items in AWS API response |
`fetchItemsByNextToken` | (parameter: { NextToken?: undefined \| string  }) => Promise\<{ NextToken?: undefined \| string  }> | the function for fetching items by NextToken |

**Returns:** Promise\<T[]>

all items fetched

___

##### repeatFetchingItemsByPosition

▸ `Static` **repeatFetchingItemsByPosition**\<T>(`fetchItemsByPosition`: (parameter: { position?: undefined \| string  }) => Promise\<{ items?: Array\<T> ; position?: undefined \| string  }>): Promise\<T[]>

Fetch items by position repeatedly.
This function is useful for client side pagination when the response from AWS API contains position and items fields.

**`example`**
```javascript
 
const domainNameObjects = await AwsUtils.repeatFetchingItemsByPosition(
  pagingParam => apig.getDomainNames({limit: 500, ...pagingParam}).promise(),
);

```
###### Type parameters:

Name | Description |
------ | ------ |
`T` | type of the items returned by AWS API  |

###### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`fetchItemsByPosition` | (parameter: { position?: undefined \| string  }) => Promise\<{ items?: Array\<T> ; position?: undefined \| string  }> | the function for fetching items by position |

**Returns:** Promise\<T[]>

all items fetched
<!-- API end -->
