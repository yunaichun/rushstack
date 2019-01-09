[Home](./index) &gt; [@microsoft/node-core-library](./node-core-library.md) &gt; [LegacyAdapters](./node-core-library.legacyadapters.md) &gt; [convertCallbackToPromise](./node-core-library.legacyadapters.convertcallbacktopromise_2.md)

## LegacyAdapters.convertCallbackToPromise() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

<b>Signature:</b>

```typescript
static convertCallbackToPromise<TResult, TError, TArg1, TArg2>(fn: (arg1: TArg1, arg2: TArg2, cb: callback<TResult, TError>) => void, arg1: TArg1, arg2: TArg2): Promise<TResult>;
```

## Parameters

|  <p>Parameter</p> | <p>Type</p> | <p>Description</p> |
|  --- | --- | --- |
|  <p>fn</p> | <p>`(arg1: TArg1, arg2: TArg2, cb: callback<TResult, TError>) => void`</p> |  |
|  <p>arg1</p> | <p>`TArg1`</p> |  |
|  <p>arg2</p> | <p>`TArg2`</p> |  |

<b>Returns:</b>

`Promise<TResult>`
