import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import withSsr from '../../utils/withSsr';
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
  id: null,
  thumbnail: '',
};
HomePageArticle.propTypes = {
  id: PropTypes.string,
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

class HomePage extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    blocs: PropTypes.arrayOf(
      PropTypes.shape(HomePageBloc.propTypes),
    ).isRequired,
  }

  static defaultProps = {
    name: 'News',
  }

  static getInitialData = async () => {
    const data = await fetch('http://localhost:8000/page?pageId=01001');
    return data.json();
  }

  render() {
    const { blocs, name } = this.props;
    return (
      <section className="home-page">
        <Helmet title={`Home Page ${name}`} />
        {blocs.map(bloc => (
          <HomePageBloc {...bloc} />
        ))}
      </section>
    );
  }
}

export default withSsr(HomePage);
