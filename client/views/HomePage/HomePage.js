import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurer';
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache';
import LazyLoad from 'react-lazyload';
import List from 'react-virtualized/dist/commonjs/List/List';
import withSsr from '../../utils/withSsr';
import config from '../../../config';
import './homePage.css';

const HomePageArticle = ({ title, snippet, image, remoteId, measure }) => (
  <article className="bloc-article">
    <Link to={{ pathname: `/article/${remoteId}` }}>
      <picture className="bloc-article__picture">
        {image && image.match('https://') && <img src={image} alt={title} onLoad={measure} />}
      </picture>
      <h2 className="bloc-article__title" dangerouslySetInnerHTML={{ __html: title }} />
      <p className="bloc-article__snippet" dangerouslySetInnerHTML={{ __html: snippet }} />
    </Link>
  </article>
);
HomePageArticle.defaultProps = {
  remoteId: null,
  image: null,
  title: '',
  snippet: '',
};
HomePageArticle.propTypes = {
  remoteId: PropTypes.string,
  title: PropTypes.string,
  snippet: PropTypes.string,
  image: PropTypes.string,
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 64,
});

const HomePageBlocsVirtualized = (blocs) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        height={height}
        width={width}
        deferredMeasurementCache={cache}
        overscanRowCount={0}
        rowCount={blocs.length}
        rowHeight={cache.rowHeight}
        rowRenderer={({ index, key, parent, style }) => (
          <CellMeasurer
            cache={cache}
            columnCount={0}
            key={key}
            parent={parent}
            rowIndex={index}
          >
          {({ measure }) => (
            <div style={style}>
              <HomePageBloc {...blocs[index]} measure={measure} />
            </div>
          )}
          </CellMeasurer>
        )}
      />
    )}
  </AutoSizer>
);

const HomePageBloc = ({ title, articles, skin, measure }) => (
  <section className={`bloc bloc--${skin}`}>
    {title && <h3 className="bloc__title">{title}</h3>}
    {articles.length > 0 && (
      <section className="bloc__articles">
        {articles.map(article => (
          <HomePageArticle key={article.remoteId} {...article} measure={measure} />
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

const HomePageBlocsPlaceholder = () => (
  <HomePageBloc articles={[{ remoteId: 'p1' }, { remoteId: 'p2' }, { remoteId: 'p3' }]} />
);

class HomePage extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    name: PropTypes.string,
    blocs: PropTypes.arrayOf(
      PropTypes.shape(HomePageBloc.propTypes),
    ),
  }

  static defaultProps = {
    name: 'News',
    blocs: [],
  }

  static getInitialData = async () => {
    const data = await fetch(`${config.apiUrl}/api/page?remoteId=01001`);
    return data.json();
  }

  render() {
    const { blocs, name, isLoading } = this.props;
    return (
      <section className="home-page">
        <Helmet title={`Home Page ${name}`} />
        {isLoading ? HomePageBlocsPlaceholder() : HomePageBlocsVirtualized(blocs)}
      </section>
    );
  }
}

export default withSsr(HomePage);
