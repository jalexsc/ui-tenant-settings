/* istanbul ignore file */

export default (server) => {
  server.get('/saml/validate', (_, request) => {
    if (request.queryParams.value === 'https://idp.ssocircle.com/meta-idp.xml') {
      return { valid: true };
    } else {
      return { valid: false };
    }
  });
  server.get('/saml/configuration', () => (
    {
      idpUrl: '',
      metadataInvalidated: true,
      okapiUrl: ''
    }
  ));
  server.put('/saml/configuration', (_, request) => JSON.parse(request.requestBody));
};
