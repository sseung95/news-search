import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useNewsSearch(query, pageNumber) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    setNewsList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    let cancel;

    axios({
      method: 'GET',
      url: `https://newsapi.org/v2/everything?apiKey=${process.env.REACT_APP_NEWS_API_KEY}`,
      params: {
        q: query,
        page: pageNumber,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const data = res.data.articles;
        const moreList = data.map((item) => ({
          id: item.title,
          title: item.title,
          date: item.publishedAt,
          url: item.url,
        }));

        setNewsList((prevNewsList) => {
          return [...prevNewsList, ...moreList];
        });
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
        setLoading(false);
      });
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, newsList };
}
