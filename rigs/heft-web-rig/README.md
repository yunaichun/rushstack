## @rushstack/heft-web-rig

This is a Rig package for [Heft](https://www.npmjs.com/package/@rushstack/heft)
used for building web projects.

This rig contains a single profile: `library`

To make use of this rig in a project built by Heft, add it as a dependency and include a
`config/rig.json` file in your project with the following contents:

```JSON
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  "rigPackageName": "@rushstack/heft-web-rig",
  "rigProfile": "library"
}
```

See the @rushstack/rig-package documentation for more information about rig packages.