import './movie-list.css';
import { Col, Row } from 'antd/lib/grid';

import Movie from '../movie';

export default function MovieList(props) {
  const { movies, sessionId } = props;

  if (movies) {
    return (
      <section className="movie-list">
        <Row gutter={[32, 32]}>
          {movies.map((movie) => (
            <Col md={24} lg={12} className="movie-list__item" key={movie.id}>
              <Movie movie={movie} sessionId={sessionId} />
            </Col>
          ))}
        </Row>
      </section>
    );
  }

  return null;
}
