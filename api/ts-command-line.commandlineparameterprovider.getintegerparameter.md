[Home](./index) &gt; [@microsoft/ts-command-line](./ts-command-line.md) &gt; [CommandLineParameterProvider](./ts-command-line.commandlineparameterprovider.md) &gt; [getIntegerParameter](./ts-command-line.commandlineparameterprovider.getintegerparameter.md)

## CommandLineParameterProvider.getIntegerParameter() method

Returns the CommandLineIntegerParameter with the specified long name.

<b>Signature:</b>

```typescript
getIntegerParameter(parameterLongName: string): CommandLineIntegerParameter;
```

## Parameters

|  <p>Parameter</p> | <p>Type</p> | <p>Description</p> |
|  --- | --- | --- |
|  <p>parameterLongName</p> | <p>`string`</p> |  |

<b>Returns:</b>

`CommandLineIntegerParameter`

## Remarks

This method throws an exception if the parameter is not defined.
