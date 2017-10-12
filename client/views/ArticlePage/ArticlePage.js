import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { getArticle } from '../../utils/mock';
import './articlePage.css';

const ArticlePage = ({ title, snippet }) => (
  <article className="article-page">
    <Helmet title={title} />
    <h2 className="article__title">{title}</h2>
    <section className="article__content">{snippet}</section>
  </article>
);

ArticlePage.propTypes = {
  title: PropTypes.string.isRequired,
  snippet: PropTypes.string.isRequired,
};

export default withRouter(({ match: { params: { id } } }) => <ArticlePage {...getArticle(id)} />);
