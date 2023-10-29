// i18n.js
module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  defaultNS: 'translations',
  pages: {
    '*': ['translations'],
    '/[lang]/*': ['translations'],
  },
  loadLocaleFrom: (lang, ns = 'translations') =>
    // You can use a dynamic import, fetch, whatever. You should
    // return a Promise with the JSON file.
    import(`./i18n/${ns}.${lang}.json`).then((m) => m.default),
}
