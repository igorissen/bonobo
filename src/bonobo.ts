import axios, { AxiosResponse } from 'axios';
import { Parser } from 'xml2js';
import { URL } from 'url';
import chalk from 'chalk';

const xmlParser = new Parser();
let debugEnabled = false;

export interface FetchOptions {
  applicationIdentifier: string;
  countryCode: string;
  debug?: boolean;
}

export interface Review {
  id: string;
  title: string;
  author: string;
  version: string;
  rating: number;
  voteCount: number;
  voteSum: number;
  message: string;
  html: string;
  updated: string;
}

export interface Page {
  isLastPage: boolean;
  reviews: Review[];
}

export function fetchItunesStoreCustomerReviews({
  applicationIdentifier,
  countryCode,
  debug = false
}: FetchOptions): Promise<Review[]> {
  debugEnabled = debug;
  _log(
    `Fetching reviews for applicationId ${chalk.blue.underline.bold(
      applicationIdentifier
    )} in ${chalk.blue.underline.bold(countryCode)}`
  );
  return new Promise<Review[]>(async (resolve, reject) => {
    let currentPage = 1;
    let done = false;
    let reviews: Review[] = [];

    while (!done) {
      try {
        const result = await _fetchPageReviews(applicationIdentifier, countryCode, currentPage);
        _log(`Page ${currentPage}: ${result.reviews.length} review${result.reviews.length > 1 ? 's' : ''} fetched`);
        done = result.isLastPage;
        reviews = [...reviews, ...result.reviews];
        if (!done) currentPage++;
      } catch (e) {
        reject(e);
      }
    }

    _log(`Total of ${reviews.length} review${reviews.length > 1 ? 's' : ''} fetched`);
    _log(chalk.green.underline.bold('DONE'));
    resolve(reviews);
  });
}

function _fetchPageReviews(applicationIdentifier: string, countryCode: string, currentPage: number): Promise<Page> {
  return _loadPage(
    `https://itunes.apple.com/${countryCode}/rss/customerreviews/page=${currentPage}/id=${applicationIdentifier}/xml`
  )
    .then(_parseBody)
    .then((response) => _formatParsedData(response, currentPage));
}

function _loadPage(url: string): Promise<any> {
  return axios.get(url);
}

function _parseBody(response: AxiosResponse): Promise<any> {
  return xmlParser.parseStringPromise(response.data);
}

function _formatParsedData(data: any, currentPage: number): Page {
  return {
    isLastPage: _isLastPage(data.feed.link, currentPage),
    reviews: _formatEntryProperty(data.feed.entry)
  };
}

function _isLastPage(items: any[], currentPage: number): boolean {
  const isLastPage = false;
  let url: string = '';

  for (const item of items) {
    if (item.$.rel === 'last') {
      url = item.$.href;
    }
  }

  if (!url?.length) return isLastPage;
  return currentPage === _getPageNumberFromUrl(url);
}

function _formatEntryProperty(entries: any[]): Review[] {
  const reviews: Review[] = [];

  for (const entry of entries) {
    const message: string = entry.content.find((item: any) => item['$'].type === 'text')._;
    reviews.push({
      id: entry.id[0],
      title: entry.title[0],
      updated: entry.updated[0],
      voteSum: parseInt(entry['im:voteSum'][0]),
      voteCount: parseInt(entry['im:voteCount'][0]),
      rating: parseInt(entry['im:rating'][0]),
      version: entry['im:version'][0],
      author: entry.author[0].name[0],
      html: message.replace(/\n/g, '<br/>'),
      message
    });
  }

  return reviews;
}

function _getPageNumberFromUrl(url: string): number {
  const parsedUrl = new URL(url);
  const result = parsedUrl.pathname.match(/\/page=(.*)\/id=/);
  return result ? parseInt(result[1]) : 1;
}

function _log(message: string): void {
  debugEnabled && console.log(`${chalk.bgMagenta.white('[BONOBO]')} ${message}`);
}
