import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import withSsr from '../../utils/withSsr';
import config from '../../../config';
import './articlePage.css';

class ArticlePage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    remoteId: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    image: PropTypes.string,
  }
  static defaultProps = {
    title: 'title',
    text: 'text',
    image: null,
    remoteId: null,
  }

  static getInitialData = async ({ match }) => {
    const data = await fetch(`${config.apiUrl}/api/article?articleId=${match.params.id}`);
    return data.json();
  }

  componentWillMount() {
    const { refetch, remoteId, match } = this.props;
    if (remoteId !== match.params.id) {
      refetch();
    }
  }

  render() {
    const { title, text, image, isLoading } = this.props;
    return isLoading ? <div>loading...</div> : (
      <article className="article-page">
        <Helmet title={title} />
        {image && (
          <picture className="article-page__picture">
            <img src={image} alt={title} />
          </picture>
        )}
        <h2 className="article-page__title" dangerouslySetInnerHTML={{ __html: title }} />
        <section className="article-page__text" dangerouslySetInnerHTML={{ __html: text }} />
      </article>
    );
  }
}

export default withRouter(withSsr(ArticlePage));
