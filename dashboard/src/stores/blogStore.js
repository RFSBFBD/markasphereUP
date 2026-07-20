import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    articles: [],
    currentArticle: null,
    total: 0,
    loading: false,
    error: null
  }),
  getters: {
    publishedArticles: (state) => state.articles.filter(a => a.status === 'published'),
    draftArticles: (state) => state.articles.filter(a => a.status === 'draft'),
    articleById: (state) => (id) => state.articles.find(a => a.id === id)
  },
  actions: {
    fetchArticles(params) {},
    fetchArticle(id) {},
    fetchArticleBySlug(slug) {},
    createArticle(data) {},
    updateArticle(id, data) {},
    deleteArticle(id) {},
    publishArticle(id) {},
    unpublishArticle(id) {}
  }
})
