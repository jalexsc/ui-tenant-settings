/* istanbul ignore file */

export default (server) => {
  server.get('/configurations/entries', (schema) => {
    return schema.configs.all();
  });

  server.post('/configurations/entries', (schema, request) => {
    const body = JSON.parse(request.requestBody);
    return schema.configs.create(body);
  });

  server.put('/configurations/entries/:id', ({ configs }, request) => {
    const matching = configs.find(request.params.id);
    const body = JSON.parse(request.requestBody);
    return matching.update(body);
  });
};
