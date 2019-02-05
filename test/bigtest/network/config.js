// typical mirage config export
export default function config() {
  this.get('/service-points', function ({ servicePoints }) {
    return this.serializerOrRegistry.serialize(servicePoints.all());
  });

  this.put('/service-points/:id', ({ servicePoints }, request) => {
    const body = JSON.parse(request.requestBody);
    const servicePoint = servicePoints.find(body.id);
    const { staffSlips } = body;
    console.log('body.', staffSlips);

    servicePoint.update({ staffSlips });
    return servicePoint.attrs;
  });

  this.get('/staff-slips-storage/staff-slips', {
    'staffSlips' : [{
      'id' : '3a051dda-3220-4569-a3d3-daeda2bd1abe',
      'name' : 'Hold',
      'active' : true,
      'template' : '<p></p>',
      'metadata' : {
        'createdDate' : '2019-02-05T14:38:39.386+0000',
        'createdByUserId' : 'd876c796-975e-53b7-a4d8-b6790e7ec6ae',
        'updatedDate' : '2019-02-05T14:38:39.386+0000',
        'updatedByUserId' : 'd876c796-975e-53b7-a4d8-b6790e7ec6ae'
      }
    }, {
      'id' : '2d98bae1-1967-4136-9992-d846cb6e78a6',
      'name' : 'Transit',
      'active' : true,
      'template' : '<p></p>',
      'metadata' : {
        'createdDate' : '2019-02-05T14:38:39.420+0000',
        'createdByUserId' : 'd876c796-975e-53b7-a4d8-b6790e7ec6ae',
        'updatedDate' : '2019-02-05T14:38:39.420+0000',
        'updatedByUserId' : 'd876c796-975e-53b7-a4d8-b6790e7ec6ae'
      }
    }],
    'totalRecords' : 2
  });

  this.get('/locations', {
    'locations' : [{
      'id' : '758258bc-ecc1-41b8-abca-f7b610822ffd',
      'name' : 'ORWIG ETHNO CD',
      'code' : 'KU/CC/DI/O',
      'isActive' : true,
      'institutionId' : '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      'campusId' : '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      'libraryId' : '5d78803e-ca04-4b4a-aeae-2c63b924518b',
      'primaryServicePoint' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'servicePointIds' : ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f']
    }, {
      'id' : 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
      'name' : 'SECOND FLOOR',
      'code' : 'KU/CC/DI/2',
      'isActive' : true,
      'institutionId' : '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      'campusId' : '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      'libraryId' : '5d78803e-ca04-4b4a-aeae-2c63b924518b',
      'primaryServicePoint' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'servicePointIds' : ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f']
    }, {
      'id' : 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      'name' : 'Main Library',
      'code' : 'KU/CC/DI/M',
      'isActive' : true,
      'institutionId' : '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      'campusId' : '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      'libraryId' : '5d78803e-ca04-4b4a-aeae-2c63b924518b',
      'primaryServicePoint' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'servicePointIds' : ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f']
    }, {
      'id' : '53cf956f-c1df-410b-8bea-27f712cca7c0',
      'name' : 'Annex',
      'code' : 'KU/CC/DI/A',
      'isActive' : true,
      'institutionId' : '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      'campusId' : '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      'libraryId' : '5d78803e-ca04-4b4a-aeae-2c63b924518b',
      'primaryServicePoint' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'servicePointIds' : ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f']
    }, {
      'id' : 'b241764c-1466-4e1d-a028-1a3684a5da87',
      'name' : 'Popular Reading Collection',
      'code' : 'KU/CC/DI/P',
      'isActive' : true,
      'institutionId' : '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      'campusId' : '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      'libraryId' : '5d78803e-ca04-4b4a-aeae-2c63b924518b',
      'primaryServicePoint' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'servicePointIds' : ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f']
    }],
    'totalRecords' : 5
  });

  this.get('/users', {
    'users' : [{
      'username' : 'diku_admin',
      'id' : 'd876c796-975e-53b7-a4d8-b6790e7ec6ae',
      'active' : true,
      'proxyFor' : [],
      'personal' : {
        'lastName' : 'ADMINISTRATOR',
        'firstName' : 'DIKU',
        'email' : 'admin@diku.example.org',
        'addresses' : []
      },
      'createdDate' : '2019-02-05T04:53:41.403+0000',
      'updatedDate' : '2019-02-05T04:53:41.403+0000'
    }],
    'totalRecords' : 1
  });
}
