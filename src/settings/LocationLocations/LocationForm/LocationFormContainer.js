import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { CalloutContext } from '@folio/stripes/core';

import LocationForm from './LocationForm';
import { useRemoteStorageApi } from '../RemoteStorage';


const LocationFormContainer = ({
  onSave,
  servicePointsByName,
  initialValues: location,
  parentMutator,
  ...rest
}) => {
  const [initialValues, setInitialValues] = useState(location);

  useEffect(() => {
    setInitialValues(location);
  }, [location?.id]);

  const callout = useContext(CalloutContext);

  function showSubmitErrorCallout(error) {
    callout.sendCallout({
      type: 'error',
      message: error.message || error.statusText || <FormattedMessage id="ui-tenant-settings.settings.save.error.network" />,
    });
  }

  const { setMapping } = useRemoteStorageApi();

  const fireSetMapping = (...args) => setMapping(...args).catch(showSubmitErrorCallout);

  const saveData = async (formData) => {
    const { remoteId: configurationId, ...locationData } = formData;

    if (locationData.id === undefined) {
      const newLocation = await parentMutator.entries.POST(locationData);
      fireSetMapping({ folioLocationId: newLocation?.id, configurationId });

      return newLocation;
    }

    fireSetMapping({ folioLocationId: locationData.id, configurationId });

    return parentMutator.entries.PUT(locationData);
  };

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

    saveData(data)
      .then(onSave)
      .catch(showSubmitErrorCallout);
  }, [onSave, servicePointsByName, saveData]);

  return (
    <LocationForm
      {...rest}
      parentMutator={parentMutator}
      initialValues={initialValues}
      onSubmit={saveLocation}
    />
  );
};

export default LocationFormContainer;
