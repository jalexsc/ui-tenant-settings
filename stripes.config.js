module.exports = {
  okapi: { 'url':'https://folio-snapshot-okapi.dev.folio.org', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    showPerms: false,
    languages: ['en'],
  },
  modules: {
    '@folio/tenant-settings' : {}
  },
};
