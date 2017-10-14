import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import withSsr from '../../utils/withSsr';
import './articlePage.css';

class ArticlePage extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
  }
  static defaultProps = {
    title: 'title',
    text: 'text',
  }

  static getInitialData = async ({ match }) => {
    const data = await fetch(`http://localhost:8000/api/article?articleId=${match.params.id}`);
    return data.json();
  }

  render() {
    const { title, text } = this.props;
    return (
      <article className="article-page">
        <Helmet title={title} />
        <h2 className="article__title">{title}</h2>
        <section className="article__content">{text}</section>
      </article>
    );
  }
}

export default withSsr(ArticlePage);
