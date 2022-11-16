/* eslint-disable no-return-await */
export default class TbmdapiService {
  apiKey = '34e69889067ccc1ed0ab9a03c56a5c59';

  apiBase = 'https://api.themoviedb.org/3';

  getResource = async (url) => {
    const res = await fetch(`${this.apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  getMovies = async () => {
    const res = await this.getResource(`/search/movie/?api_key=${this.apiKey}&query=return&page=1`);
    return res.results;
  };
}
