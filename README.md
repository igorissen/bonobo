# BONOBO

A simple library to fetch all reviews left by your users for your iOS and Mac applications.

## Getting started

### Installation

```
$ npm install @igorissen/bonobo
```

### Usage

- Using Javascript

```javascript
const { fetchItunesStoreCustomerReviews } = require('@igorissen.bonobo');

fetchItunesStoreCustomerReviews({
    applicationIdentifier: '840784742',
    countryCode: 'us'
  })
  .then(console.log)
  .catch(console.error);
```

- Using TypeScript

```typescript
import { fetchItunesStoreCustomerReviews } from '@igorissen/bonobo';

fetchItunesStoreCustomerReviews({
    applicationIdentifier: '840784742',
    countryCode: 'us'
  })
  .then(console.log)
  .catch(console.error);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
