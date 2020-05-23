# BONOBO ![Bonobo CI](https://github.com/igorissen/bonobo/workflows/Bonobo%20CI/badge.svg?branch=master)

A simple library to fetch all reviews left by your users for your iOS and Mac applications.

## Migration guides

- [From v1.x to v2.x](https://github.com/igorissen/bonobo/wiki/Migrate-from-1.x-to-2.x)

## Getting started

### Installation

```
$ npm install @igorissen/bonobo
```

### Usage

- Import the module

```typescript
// JavaScript
const { Bonobo } = require('@igorissen.bonobo');

// TypeScript
import { Bonobo } from '@igorissen/bonobo';
```

- Create an instance of `Bonobo`

```typescript
const bonobo = new Bonobo({
  debugEnabled: true // default: false
});
```

- Use newly created instance

```typescript
// Fetch an application reviews from one or multiple countries
bonobo.fetchApplicationReviews('840784742', ['us'])
  .then(console.log)
  .catch(console.error);

// Fetch reviews for multiple applications from one or multiple countries
bonobo.fetchApplicationsReviews(['840784742', '1081877377'], ['us', 'fr', 'be'])
  .then(console.log)
  .catch(console.error);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
