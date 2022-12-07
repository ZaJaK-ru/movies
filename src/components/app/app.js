/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/order */
/* eslint-disable react/state-in-constructor */
import { Component } from 'react';
import { Alert, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import SearchPage from '../search-page';
import RatedPage from '../rated-page';
import { GenresProvider } from '../genres-context';

import './app.css';

import TbmdapiService from '../../services/tmbdapi-service';

export default class App extends Component {
  tmbdapiService = new TbmdapiService();

  state = {
    genres: [],
    sessionId: '',
    isRate: false,
  };

  componentDidMount() {
    localStorage.setItem('rating', JSON.stringify({}));
    this.getGenres();
    this.createGuestSession();
  }

  createGuestSession = () => {
    this.tmbdapiService
      .createGuestSession()
      .then((data) => {
        this.setState({ sessionId: data.guest_session_id });
      })
      .catch((isErrors) => this.setState({ isErrors }));
  };

  getGenres = () => {
    this.tmbdapiService
      .getGenres()
      .then((data) => {
        this.setState({ genres: data.genres });
      })
      .catch((isErrors) => this.setState({ isErrors }));
  };

  render() {
    const { genres, sessionId, isErrors, isRate } = this.state;
    const viewErrors = isErrors ? <Alert message={isErrors.message} type="error" /> : null;
    const items = [
      { label: 'Search', key: 'item-1', children: <SearchPage sessionId={sessionId} /> }, // remember to pass the key prop
      { label: 'Rated', key: 'item-2', children: <RatedPage sessionId={sessionId} isRate={isRate} /> },
    ];

    return (
      <div className="app">
        <Online>
          {viewErrors}
          <GenresProvider value={genres}>
            <Tabs items={items} centered onChange={() => this.setState({ isRate: !isRate })} />
          </GenresProvider>
        </Online>
        <Offline>
          <Alert message="No internet" type="error" />
        </Offline>
      </div>
    );
  }
}
