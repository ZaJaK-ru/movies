/* eslint-disable no-return-await */
export default class TbmdapiService {
  apiKey = '34e69889067ccc1ed0ab9a03c56a5c59';

  apiBase = 'https://api.themoviedb.org/3';

  getSearchMovies = async (query, page) => {
    const res = await fetch(`${this.apiBase}/search/movie/?api_key=${this.apiKey}&query=${query}&page=${page}`);
    return await res.json();
  };

  getGenres = async () => {
    const res = await fetch(`${this.apiBase}/genre/movie/list?api_key=${this.apiKey}`);
    return await res.json();
  };

  createGuestSession = async () => {
    const res = await fetch(`${this.apiBase}/authentication/guest_session/new?api_key=${this.apiKey}`);
    return await res.json();
  };

  getRatedMovies = async (sessionId) => {
    // page = 1
    const res = await fetch(`${this.apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}`); // &page=${page}
    return await res.json();
  };

  rateMovie = async (movieId, sessionId, data) => {
    const res = await fetch(
      `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  };
}
