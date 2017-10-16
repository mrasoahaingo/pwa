export const getFormattedBlocs = (data) =>
  data.page.rankings.News.blocs
  .map(bloc => {
    const articles = [];
    if (!bloc.profil || bloc.feed.length === 0) {
      return {
        title: bloc.family,
        articles,
      };
    }
    bloc.feed.forEach(article => {
      const newArticle = {
        remoteId: article.remoteId,
        title: article.default.title,
        snippet: article.default.snippet,
        image: article.default.image,
      };
      articles.push(newArticle);
    });
    const newBloc = {
      title: bloc.titre,
      articles,
      skin: bloc.skin,
    };
    return newBloc;
  });

export const getFormattedArticle = (data) => ({
  title: (data.news.feed[0] || { default: {} }).default.title,
  image: (data.news.feed[0] || { default: {} }).default.image,
  text: (data.news.feed[0] || {}).text,
  remoteId: (data.news.feed[0] || {}).remoteId,
});
