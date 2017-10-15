import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurer';
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache';
import List from 'react-virtualized/dist/commonjs/List/List';
import withSsr from '../../utils/withSsr';
import config from '../../../config';
import './homePage.css';

const HomePageArticle = ({ title, snippet, image, id }) => (
  <article className="bloc-article">
    <Link to={{ pathname: `/article/${id}` }}>
      {image && (
        <picture className="bloc-article__picture">
          <img src={image} alt={title} />
        </picture>
      )}
      <h2 className="bloc-article__title" dangerouslySetInnerHTML={{ __html: title }} />
      <p className="bloc-article__snippet" dangerouslySetInnerHTML={{ __html: snippet }} />
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
  image: PropTypes.string,
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 64,
});

const HomePageBlocs = (blocs) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        height={height}
        width={width}
        deferredMeasurementCache={cache}
        overscanRowCount={10}
        rowCount={blocs.length}
        rowHeight={cache.rowHeight}
        rowRenderer={({ index, key, parent }) => (
          <CellMeasurer
            cache={cache}
            columnCount={0}
            key={key}
            parent={parent}
            rowIndex={index}
          >
            <HomePageBloc {...blocs[index]} />
          </CellMeasurer>
        )}
      />
    )}
  </AutoSizer>
);

const HomePageBloc = ({ title, articles, skin }) => (
  <section className={`bloc bloc--${skin}`}>
    {title && <h3 className="bloc__title">{title}</h3>}
    {articles.length > 0 && (
      <section className="bloc__articles">
        {articles.map(article => (
          <HomePageArticle {...article} />
        ))}
      </section>
    )}
  </section>
);
HomePageBloc.defaultProps = {
  title: '',
  skin: 'news',
};
HomePageBloc.propTypes = {
  title: PropTypes.string,
  skin: PropTypes.string,
  articles: PropTypes.arrayOf(
    PropTypes.shape(HomePageArticle.propTypes),
  ).isRequired,
};

class HomePage extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    name: PropTypes.string,
    blocs: PropTypes.arrayOf(
      PropTypes.shape(HomePageBloc.propTypes),
    ).isRequired,
  }

  static defaultProps = {
    name: 'News',
  }

  static getInitialData = async () => {
    const data = await fetch(`${config.apiUrl}/api/page?pageId=01001`);
    return data.json();
  }

  render() {
    const { blocs, name, isLoading } = this.props;
    return isLoading ? <div>loading...</div> : (
      <section className="home-page">
        <Helmet title={`Home Page ${name}`} />
        {HomePageBlocs(blocs)}
      </section>
    );
  }
}

export default withSsr(HomePage);
