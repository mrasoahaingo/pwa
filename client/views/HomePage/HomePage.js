import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { getBlocs } from '../../utils/mock';
import './homePage.css';

const HomePageArticle = ({ title, snippet, thumbnail, id }) => (
  <article>
    <Link to={{ pathname: `/article/${id}` }}>
      {thumbnail && <img src={thumbnail} alt={title} />}
      <h2>{title}</h2>
      <p>{snippet}</p>
    </Link>
  </article>
);
HomePageArticle.defaultProps = {
  thumbnail: '',
};
HomePageArticle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  snippet: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
};

const HomePageBloc = ({ title, articles }) => (
  <section>
    {title && <h3>{title}</h3>}
    <section>
      {articles.map(article => (
        <HomePageArticle {...article} />
      ))}
    </section>
  </section>
);
HomePageBloc.defaultProps = {
  title: '',
};
HomePageBloc.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.arrayOf(
    PropTypes.shape(HomePageArticle.propTypes),
  ).isRequired,
};

const HomePage = ({ name, blocs }) => (
  <section className="home-page">
    <Helmet title={`Home Page ${name}`} />
    {blocs.map(bloc => (
      <HomePageBloc {...bloc} />
    ))}
  </section>
);

HomePage.propTypes = {
  name: PropTypes.string.isRequired,
  blocs: PropTypes.arrayOf(
    PropTypes.shape(HomePageBloc.propTypes),
  ).isRequired,
};

export default () => <HomePage name="Actualité" blocs={getBlocs()} />;
