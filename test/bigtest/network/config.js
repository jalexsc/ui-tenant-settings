// typical mirage config export
export default function config() {
  this.get('/service-points', function (schema) {
    return schema.servicePoints.all();
  });

  this.put('/service-points/:id', ({ servicePoints }, request) => {
    const body = JSON.parse(request.requestBody);
    const { staffSlips } = body;
    const servicePoint = servicePoints.find(body.id);
    servicePoint.update({ staffSlips });
    return servicePoint.attrs;
  });

  this.get('/staff-slips-storage/staff-slips', (schema) => {
    return schema.staffSlips.all();
  });

  this.get('/users', (schema) => {
    return schema.users.all();
  });

  this.get('/locations', () => {
    return { locations: [] };
  });
}
