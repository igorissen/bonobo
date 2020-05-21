import * as chai from 'chai';

import { fetchItunesStoreCustomerReviews, Review } from '../src/bonobo';

const expect = chai.expect;

describe('Bonobo: iTunes Store customer reviews fetcher', () => {
  it('should be able to fetch all reviews for an application in a country', async () => {
    const reviews: Review[] = await fetchItunesStoreCustomerReviews({
      applicationIdentifier: '840784742',
      countryCode: 'us'
    });

    expect(reviews).to.exist;
    expect(reviews).to.be.an('array');
    expect(reviews).to.have.length.gt(100);
  });
});
