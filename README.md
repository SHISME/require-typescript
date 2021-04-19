A tool for Require typescript modules in node.

## Installation
```shell
npm install require-typescript --save
```

## Usage

```typescript

// config.ts

export default {
  name: 'config'
}

```

```javascript

const { requireTypescript } = require('require-typescript');

const path = require('path');

const config = requireTypescript(path.resolve(__dirname, './config.ts')); // { name: 'config' }
```