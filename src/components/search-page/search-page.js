/* eslint-disable react/state-in-constructor */
import { Component } from 'react';
import { debounce } from 'lodash';
import { Spin, Alert, Input, Pagination } from 'antd';

import './search-page.css';

import MovieList from '../movie-list';
import TbmdapiService from '../../services/tmbdapi-service';

export default class SearchPage extends Component {
  tmbdapiService = new TbmdapiService();

  state = {
    movies: [],
    moviesTotal: 0,
    isErrors: false,
    isLoading: false,
    currentPage: 1,
    searchQuery: '',
    inputValue: '',
  };

  debounceSearchQuery = debounce((value) => {
    this.setState({ searchQuery: value });
  }, 500);

  componentDidMount() {
    const { currentPage, searchQuery } = this.state;

    if (searchQuery) {
      this.setState({ isLoading: true });
      this.getMovies(searchQuery, currentPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery } = this.state;

    if (searchQuery !== prevState.searchQuery && searchQuery !== '') {
      this.setState({ currentPage: 1 });
      this.getMovies(searchQuery, 1);
    }
  }

  getMovies = (query, page) => {
    this.setState({ isLoading: true });

    this.tmbdapiService
      .getSearchMovies(query, page)
      .then((data) => {
        this.setState({ movies: data.results, moviesTotal: data.total_results, isLoading: false });
      })
      .catch((isErrors) => this.setState({ isErrors, isLoading: false }));
  };

  handleInput = (e) => {
    this.setState({ inputValue: e.target.value });
    this.debounceSearchQuery(e.target.value);
  };

  onChangePage = (page) => {
    const { searchQuery } = this.state;

    this.setState({ currentPage: page });
    this.getMovies(searchQuery, page);
  };

  render() {
    const { movies, moviesTotal, isErrors, isLoading, currentPage, inputValue } = this.state;
    const { sessionId } = this.props;

    const viewMovies = isLoading ? <Spin size="large" /> : <MovieList movies={movies} sessionId={sessionId} />;
    const viewErrors = isErrors ? <Alert message={isErrors.message} type="error" /> : null;

    return (
      <>
        <Input
          className="search__input"
          value={inputValue}
          onChange={this.handleInput}
          placeholder="Type to search..."
        />
        {viewErrors}
        {viewMovies}
        <Pagination
          className="search__pagination"
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
