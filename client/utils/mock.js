export const getBlocs = (data) =>
  data.page.rankings.News.blocs
  .filter(bloc => !(!bloc.profil || bloc.feed.length === 0))
  .map(bloc => {
    const articles = [];
    bloc.feed.forEach(article => {
      const newArticle = {
        id: article.srcId,
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

export const getArticle = (data) => data;
