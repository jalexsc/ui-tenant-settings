// typical mirage config export
export default function config() {
  this.get('/service-points', {
    'servicepoints' : [{
      'id' : '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      'name' : 'Circ Desk 1',
      'code' : 'cd1',
      'discoveryDisplayName' : 'Circulation Desk -- Hallwa',
      'pickupLocation' : true,
      'period' : {
        'duration' : 1,
        'intervalId' : 'Months'
      },
      'metadata' : {
        'createdDate' : '2019-01-01T02:49:32.907+0000',
        'createdByUserId' : 'ed1c494b-a9c8-5062-ac7b-dde337f860f8',
        'updatedDate' : '2019-01-16T16:46:15.642+0000',
        'updatedByUserId' : 'ed1c494b-a9c8-5062-ac7b-dde337f860f8'
      }
    }, {
      'id' : 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
      'name' : 'Circ Desk ',
      'code' : 'cd2',
      'discoveryDisplayName' : 'Circulation Desk -- Back Entrance',
      'pickupLocation' : true,
      'period' : {
        'duration' : 1,
        'intervalId' : 'Months'
      },
      'metadata' : {
        'createdDate' : '2019-01-01T02:49:33.962+0000',
        'createdByUserId' : 'ed1c494b-a9c8-5062-ac7b-dde337f860f8',
        'updatedDate' : '2019-01-16T20:54:33.613+0000',
        'updatedByUserId' : 'ed1c494b-a9c8-5062-ac7b-dde337f860f8'
      }
    }],
    'totalRecords' : 2
  });
}
