import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  cloneDeep,
  unset,
  orderBy,
} from 'lodash';

import ServicePointForm from './ServicePointForm';

const ServicePointFormContainer = ({
  onSave,
  parentResources,
  initialValues: servicePoint,
  ...rest
}) => {
  const [initialValues, setInitialValues] = useState(servicePoint);

  useEffect(() => {
    setInitialValues(servicePoint);
  }, [servicePoint?.id, parentResources?.staffSlips?.hasLoaded]);

  const transformStaffSlipsData = useCallback((staffSlips) => {
    const currentSlips = parentResources?.staffSlips?.records || [];
    const allSlips = orderBy(currentSlips, 'name');

    return staffSlips.map((printByDefault, index) => {
      const { id } = allSlips[index];
      return { id, printByDefault };
    });
  }, [parentResources?.staffSlips]);

  const onSubmit = useCallback((values) => {
    const data = cloneDeep(values);

    const { locationIds, staffSlips } = data;

    if (locationIds) {
      data.locationIds = locationIds.filter(l => l).map(l => (l.id ? l.id : l));
    }

    if (!data.pickupLocation) {
      unset(data, 'holdShelfExpiryPeriod');
    }

    unset(data, 'location');

    onSave({
      ...data,
      staffSlips: transformStaffSlipsData(staffSlips)
    });
  }, [onSave, transformStaffSlipsData]);

  return (
    <ServicePointForm
      {...rest}
      onSubmit={onSubmit}
      parentResources={parentResources}
      initialValues={initialValues}
    />
  );
};

export default ServicePointFormContainer;
