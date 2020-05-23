export type BonoboOptions = {
  debugEnabled: boolean;
};

export type Review = {
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
};

export type CountriesReviews = {
  [key: string]: Review[];
};

export type ApplicationsReviews = {
  [key: string]: CountriesReviews;
};
