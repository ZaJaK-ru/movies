/* eslint-disable react/state-in-constructor */
import { Component } from 'react';
import { Spin } from 'antd';

import './app.css';

import MovieList from '../movie-list';
import TbmdapiService from '../../services/tmbdapi-service';

export default class App extends Component {
  tmbdapiService = new TbmdapiService();

  state = {
    movies: [],
    isLoading: true,
  };

  componentDidMount() {
    this.tmbdapiService.getMovies().then((movies) => {
      this.setState({ movies, isLoading: false });
    });
  }

  render() {
    const { isLoading, movies } = this.state;

    return <div className="app">{isLoading ? <Spin size="large" /> : <MovieList movies={movies} />}</div>;
  }
}
