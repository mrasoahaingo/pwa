import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import withSsr from '../../utils/withSsr';
import config from '../../../config';
import './articlePage.css';

const Article = ({ title, text, image }) => (
  <article className="article-page">
    <Helmet title={title} />
    <picture className="article-page__picture">
      {image && <img src={image} alt={title} />}
    </picture>
    <h2 className="article-page__title" dangerouslySetInnerHTML={{ __html: title }} />
    <section className="article-page__text" dangerouslySetInnerHTML={{ __html: text }} />
  </article>
);

Article.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  image: PropTypes.string,
};

Article.defaultProps = {
  title: '',
  text: '',
  image: '',
};

class ArticlePage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
    remoteId: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    remoteId: null,
  }

  static getInitialData = async ({ match }) => {
    const data = await fetch(`${config.apiUrl}/api/article?remoteId=${match.params.remoteId}`);
    return data.json();
  }

  componentWillMount() {
    const { refetch, remoteId, match } = this.props;
    if (remoteId && remoteId !== match.params.remoteId) {
      refetch();
    }
  }

  render() {
    const { isLoading, ...article } = this.props;
    return isLoading ? <Article /> : <Article {...article} />;
  }
}

export default withRouter(withSsr(ArticlePage));
