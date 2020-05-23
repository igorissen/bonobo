import chalk from 'chalk';

import { ApplicationsReviews, BonoboOptions, CountriesReviews, Review } from './models';
import { fetchPageReviews } from './helpers';

export class Bonobo {
  private readonly _debugEnabled: boolean;

  constructor({ debugEnabled = false }: BonoboOptions) {
    this._debugEnabled = debugEnabled;
    this._log('Object instantiated');
  }

  public fetchApplicationReviews(applicationIdentifier: string, countries: string[]): Promise<CountriesReviews> {
    return new Promise<CountriesReviews>(async (resolve, reject) => {
      const result: CountriesReviews = {};

      for (const country of countries) {
        let currentPage = 1;
        let done = false;
        let reviews: Review[] = [];

        while (!done) {
          try {
            this._log(
              `Fetching reviews for applicationId ${chalk.blue.underline.bold(
                applicationIdentifier
              )} in ${chalk.blue.underline.bold(country)}`
            );
            const result = await fetchPageReviews(applicationIdentifier, country, currentPage);
            this._log(
              `Page ${currentPage}: ${result.reviews.length} review${result.reviews.length > 1 ? 's' : ''} fetched`
            );
            done = result.isLastPage;
            reviews = [...reviews, ...result.reviews];
            if (!done) currentPage++;
          } catch (e) {
            reject(e);
          }
        }

        this._log(`Total of ${reviews.length} review${reviews.length > 1 ? 's' : ''} fetched`);
        this._log(`${chalk.green.underline.bold('DONE')} > country code : ${country}`);
        result[country] = reviews;
      }

      resolve(result);
    });
  }

  public fetchApplicationsReviews(applicationsIdentifier: string[], countries: string[]): Promise<ApplicationsReviews> {
    return new Promise<ApplicationsReviews>(async (resolve, reject) => {
      const result: ApplicationsReviews = {};

      for (const applicationIdentifier of applicationsIdentifier) {
        try {
          result[applicationIdentifier] = await this.fetchApplicationReviews(applicationIdentifier, countries);
        } catch (e) {
          reject(e);
        }
      }

      resolve(result);
    });
  }

  private _log(message: string): void {
    this._debugEnabled && console.log(`${chalk.bgMagenta.white('[BONOBO]')} ${message}`);
  }
}
