/* istanbul ignore file */
export default server => {
  const institution = server.create('institution', {
    name: 'Institution 1',
    code: 'INST1',
  });
  const campus = server.create('campus', {
    name: 'Campus 1',
    code: 'CAMP1',
    institutionId: institution.id,
  });
  const library = server.create('library', {
    name: 'Library 1',
    code: 'LIB1',
    campusId: campus.id,
  });

  server.create('library', {
    name: 'Library 2',
    code: '',
    campusId: campus.id,
  });
  server.create('location', {
    name: '1 Location',
    code: 'LOC1',
    libraryId: library.id,
  });
  server.create('location', {
    name: '2 Location',
    code: 'LOC2',
    isActive: false,
    libraryId: library.id,
  });
};
