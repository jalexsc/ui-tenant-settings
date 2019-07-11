/* istanbul ignore file */
export default server => {
  const institution = server.create('institution', {
    name: 'Institution 1',
    code: 'code',
  });
  const campus = server.create('campus', {
    name: 'Campus 1',
    code: 'code',
    institutionId: institution.id,
  });
  const library = server.create('library', {
    name: 'Library 1',
    code: 'code',
    campusId: campus.id,
  });

  server.create('location', {
    name: '1 Location',
    code: 'code',
    libraryId: library.id,
  });
  server.create('location', {
    name: '2 Location',
    code: 'code',
    isActive: false,
    libraryId: library.id,
  });
};
