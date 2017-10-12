import data from './mock.json';

const mock = {
  articles: {},
  blocs: [],
};

const addBloc = (bloc) => {
  mock.blocs = [...mock.blocs, bloc];
};

const addArticle = (article) => {
  mock.articles = { ...mock.articles, [article.id]: article };
};

data.page.rankings.News.blocs.forEach(bloc => {
  if (!bloc.profil || bloc.feed.length === 0) {
    return;
  }
  const articles = [];
  bloc.feed.forEach(article => {
    const newArticle = {
      id: article.srcId,
      title: article.default.title,
      snippet: article.default.snippet,
      image: article.default.image,
    };
    addArticle(newArticle);
    articles.push(newArticle);
  });
  const newBloc = {
    title: bloc.titre,
    articles,
  };
  addBloc(newBloc);
});

export const getArticle = (id) => mock.articles[id];
export const getBlocs = () => mock.blocs;
