export const getFormattedBlocs = (data) =>
  data.page.rankings.News.blocs
  .filter(bloc => !(!bloc.profil || bloc.feed.length === 0))
  .map(bloc => {
    const articles = [];
    bloc.feed.forEach(article => {
      const newArticle = {
        id: article.remoteId,
        title: article.default.title,
        snippet: article.default.snippet,
        image: article.default.image,
      };
      articles.push(newArticle);
    });
    const newBloc = {
      title: bloc.titre,
      articles,
    };
    return newBloc;
  });

export const getFormattedArticle = (data) => ({
  title: (data.news.feed[0] || { default: {} }).default.title,
  text: (data.news.feed[0] || {}).text,
});
