/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
/* eslint-disable camelcase */
import { Component } from 'react';
import { Card, Typography, Tag, Spin, Rate } from 'antd';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import TbmdapiService from '../../services/tmbdapi-service';
import { GenresConsumer } from '../genres-context';

import noimage from './noimage.png';

import './movie.css';

const getImage = (path) => `https://image.tmdb.org/t/p/w500/${path}`;

const truncate = (str, max, suffix) =>
  str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;

export default class Movie extends Component {
  tmbdapiService = new TbmdapiService();

  state = {
    imageLoad: false,
    rateValue: 0,
  };

  componentDidMount() {
    const { movie } = this.props;
    const savedRating = JSON.parse(localStorage.getItem('rating'));

    if (savedRating) {
      if (savedRating[movie.id]) this.setState({ rateValue: savedRating[movie.id] });
    }
  }

  onRate = (value) => {
    const { movie, sessionId } = this.props;

    this.tmbdapiService.rateMovie(movie.id, sessionId, { value }).then(() => {
      const newSavedRating = JSON.parse(localStorage.getItem('rating'));
      newSavedRating[movie.id] = value;
      localStorage.setItem('rating', JSON.stringify(newSavedRating));
      this.setState({ rateValue: value });
    });
  };

  render() {
    const { Title, Paragraph, Text } = Typography;
    const { imageLoad, rateValue } = this.state;
    const { poster_path, original_title, release_date, overview, vote_average, genre_ids } = this.props.movie;
    const date = release_date ? format(parseISO(release_date), 'MMMM d, y') : null;
    const cover = (
      <>
        {imageLoad ? null : <Spin />}
        <img
          src={poster_path ? getImage(poster_path) : noimage}
          alt=""
          style={imageLoad ? {} : { display: 'none' }}
          onLoad={() => {
            this.setState({ imageLoad: true });
          }}
        />
      </>
    );

    const rateCircleColor = (value) => {
      if (value <= 3) return '#E90000';
      if (value <= 5) return '#E97E00';
      if (value <= 7) return '#E9D100';
      return '#66E900';
    };

    const genresView = (genresList, genresMovie) => {
      if (genresMovie && genresList) {
        return genresMovie.map((genreID) => {
          const genreObj = genresList.find(({ id }) => id === genreID);
          return <Tag key={genreObj.id}>{genreObj.name}</Tag>;
        });
      }
      return null;
    };

    return (
      <Card className="movie" cover={cover} bordered={false}>
        <div className="movie__rate-circle" style={{ borderColor: rateCircleColor(vote_average) }}>
          {Math.round(vote_average * 10) / 10}
        </div>
        <Title className="movie__title">{original_title}</Title>
        <Text className="movie__date">{date}</Text>
        <GenresConsumer>
          {(genres) => <div className="movie__genres">{genresView(genres, genre_ids)}</div>}
        </GenresConsumer>
        <Paragraph className="movie__overview">{overview ? truncate(overview, 150, '...') : 'No overview'}</Paragraph>
        <Rate className="movie__rate" allowHalf count={10} onChange={this.onRate} value={rateValue} />
      </Card>
    );
  }
}
