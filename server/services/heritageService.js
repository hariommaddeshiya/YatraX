import { seedHeritageSites } from '../seed/destinationsData.js';

export const getHeritageSites = () => {
  return seedHeritageSites;
};

export const getHeritageSiteById = (id) => {
  return seedHeritageSites.find(site => site.id === id) || seedHeritageSites[0];
};
