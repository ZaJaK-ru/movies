/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import { Component } from 'react';
import { Card, Typography, Tag } from 'antd';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import './movie.css';

const getImage = (path) => `https://image.tmdb.org/t/p/w500/${path}`;

const truncate = (str, max, suffix) =>
  str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;

export default class Movie extends Component {
  render() {
    const { Title, Paragraph, Text } = Typography;
    const { poster_path, original_title, release_date, overview } = this.props.movie;
    const cover = <img src={getImage(poster_path)} alt={original_title} />;
    const date = release_date ? format(parseISO(release_date), 'MMMM d, y') : null;
    return (
      <Card className="movie" cover={cover} bordered={false}>
        <Title className="movie__title">{original_title}</Title>
        <Text className="movie__date">{date}</Text>
        <Tag className="movie__genres">Genre</Tag>
        <Paragraph className="movie__overview">{truncate(overview, 150, '...')}</Paragraph>
      </Card>
    );
  }
}
