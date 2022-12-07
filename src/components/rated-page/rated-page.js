/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
import { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';

import MovieList from '../movie-list';
import TbmdapiService from '../../services/tmbdapi-service';

export default class RatedPage extends Component {
  tmbdapiService = new TbmdapiService();

  state = {
    movies: [],
    moviesTotal: 0,
    isErrors: false,
    isLoading: false,
    currentPage: 1,
  };

  componentDidMount() {
    const { currentPage } = this.state;
    const { sessionId } = this.props;

    window.addEventListener('offline', () => {
      this.setState({ isErrors: new Error('Offline') });
    });
    window.addEventListener('online', () => {
      this.setState({ isErrors: null });
    });

    this.getRatedMovies(sessionId, currentPage);
  }

  componentDidUpdate(prevProps) {
    const { isRate, sessionId } = this.props;

    if (isRate !== prevProps.isRate) {
      this.setState({ currentPage: 1 });
      this.getRatedMovies(sessionId, 1);
    }
  }

  getRatedMovies = (sessionId, page) => {
    this.setState({ isLoading: true });

    this.tmbdapiService
      .getRatedMovies(sessionId, page)
      .then((data) => {
        this.setState({ movies: data.results, isLoading: false });
      })
      .catch((isErrors) => this.setState({ isErrors, isLoading: false }));
  };

  onChangePage = (page) => {
    const { sessionId } = this.props;

    this.setState({ currentPage: page });
    this.getRatedMovies(sessionId, page);
  };

  render() {
    const { movies, moviesTotal, isErrors, isLoading, currentPage } = this.state;
    const { sessionId } = this.props;

    const viewMovies = isLoading ? <Spin size="large" /> : <MovieList movies={movies} sessionId={sessionId} />;
    const viewErrors = isErrors ? <Alert message={isErrors.message} type="error" /> : null;

    return (
      <>
        {viewErrors}
        {viewMovies}
        <Pagination
          current={currentPage}
          total={moviesTotal}
          pageSize={20}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onChangePage}
        />
      </>
    );
  }
}
