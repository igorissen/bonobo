import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';
import { Parser } from 'xml2js';

import { Review } from './models';

const xmlParser = new Parser();

type Page = {
  isLastPage: boolean;
  reviews: Review[];
};

export function fetchPageReviews(
  applicationIdentifier: string,
  countryCode: string,
  currentPage: number
): Promise<Page> {
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

function _getPageNumberFromUrl(url: string): number {
  const parsedUrl = new URL(url);
  const result = parsedUrl.pathname.match(/\/page=(.*)\/id=/);
  return result ? parseInt(result[1]) : 1;
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
