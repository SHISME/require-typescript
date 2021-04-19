A tool for Require typescript modules in node.

## Installation
```shell
npm install require-typescript-module --save
```

## Usage

```typescript

// config.ts

export default {
  name: 'config'
}

```

```javascript

const { requireTypescriptModule } = require('require-typescript-module');

const path = require('path');

const config = requireTypescriptModule(path.resolve(__dirname, './config.ts')); // { name: 'config' }
```