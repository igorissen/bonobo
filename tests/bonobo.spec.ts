import * as chai from 'chai';

import { Bonobo } from '../src/lib/bonobo';
import { ApplicationsReviews, CountriesReviews } from '../src/lib/models';

const expect = chai.expect;
let bonobo;

describe('Bonobo: iTunes Store customer reviews fetcher', () => {
  beforeEach(() => {
    bonobo = new Bonobo({ debugEnabled: true });
  });

  it('should be able to fetch all reviews for Movist application in US country', async () => {
    const reviews: CountriesReviews = await bonobo.fetchApplicationReviews('840784742', ['us']);

    expect(reviews).to.exist;
    expect(reviews.us).to.exist;
    expect(reviews.us).to.be.an('array');
    expect(reviews.us).to.have.length.greaterThan(0);
  });

  it('should be able to fetch all reviews for Serist application in US and BE countries', async () => {
    const reviews: CountriesReviews = await bonobo.fetchApplicationReviews('1081877377', ['us', 'be']);

    expect(reviews).to.exist;
    expect(reviews).to.haveOwnProperty('us');
    expect(reviews).to.haveOwnProperty('be');

    expect(reviews.us).to.exist;
    expect(reviews.us).to.be.an('array');
    expect(reviews.us).to.have.length.greaterThan(0);

    expect(reviews.be).to.exist;
    expect(reviews.be).to.be.an('array');
    expect(reviews.be).to.have.length.greaterThan(0);
  });

  it('should be able to fetch all reviews for Rippple and 4:7:8 Breathing applications in US country', async () => {
    const reviews: ApplicationsReviews = await bonobo.fetchApplicationsReviews(['1309894528', '1215848591'], ['us']);

    expect(reviews).to.exist;

    // Testing Rippple application
    expect(reviews).to.haveOwnProperty('1309894528');
    expect(reviews['1309894528']).to.haveOwnProperty('us');
    expect(reviews['1309894528'].us).to.exist;
    expect(reviews['1309894528'].us).to.be.an('array');
    expect(reviews['1309894528'].us).to.have.length.greaterThan(0);

    // Testing 4:7:8 Breathing
    expect(reviews).to.haveOwnProperty('1215848591');
    expect(reviews['1215848591']).to.haveOwnProperty('us');
    expect(reviews['1215848591'].us).to.exist;
    expect(reviews['1215848591'].us).to.be.an('array');
    expect(reviews['1215848591'].us).to.have.length.greaterThan(0);
  });
});
