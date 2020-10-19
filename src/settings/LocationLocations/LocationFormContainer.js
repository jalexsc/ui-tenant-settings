import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cloneDeep } from 'lodash';

import LocationForm from './LocationForm';

const LocationFormContainer = ({
  onSave,
  servicePointsByName,
  initialValues: location,
  ...rest
}) => {
  const [initialValues, setInitialValues] = useState(location);

  useEffect(() => {
    setInitialValues(location);
  }, [location?.id]);

  const saveLocation = useCallback((updatedLocation) => {
    const data = cloneDeep(updatedLocation);

    const servicePointsObject = {};

    servicePointsObject.servicePointIds = [];
    data.servicePointIds.forEach((item) => {
      if (item.selectSP) {
        servicePointsObject.servicePointIds.push(servicePointsByName[item.selectSP]);
        if (item.primary) servicePointsObject.primaryServicePoint = servicePointsByName[item.selectSP];
      }
    });

    const detailsObject = {};
    if (!data.detailsArray) {
      data.detailsArray = [];
    }
    data.detailsArray.forEach(i => {
      if (i.name !== undefined) detailsObject[i.name] = i.value;
    });
    delete data.detailsArray;
    data.details = detailsObject;
    data.primaryServicePoint = servicePointsObject.primaryServicePoint;
    data.servicePointIds = servicePointsObject.servicePointIds;

    onSave(data);
  }, [onSave, servicePointsByName]);

  return (
    <LocationForm
      {...rest}
      initialValues={initialValues}
      onSubmit={saveLocation}
    />
  );
};

export default LocationFormContainer;
