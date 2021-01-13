import React from 'react';
import { Select, Tooltip } from '@folio/stripes/components';

import { useRemoteStorageApi } from './Provider';

const SelectWithTooltip = ({ label, sub, ...rest }) => (
  <Tooltip
    text={label}
    sub={sub}
    id="remote-storage-tooltip"
  >
    {({ ref, ariaIds }) => (
      <Select
        label={label}
        inputRef={ref}
        aria-labelledby={ariaIds.text}
        aria-describedby={ariaIds.sub}
        {...rest}
      />
    )}
  </Tooltip>
);

const CustomSelect = ({ message, ...rest }) => (
  message
    ? <SelectWithTooltip sub={message} {...rest} />
    : <Select {...rest} />
);

export const Control = ({ disabled, readOnly, message, ...rest }) => {
  const { configurations, t } = useRemoteStorageApi();

  const errorMessage = configurations.failed && t`failed`;
  const loadingMessage = configurations.isPending && t`loading`;
  const isDisabled = disabled || !configurations.hasLoaded;

  const configurationOptions = configurations.records.map(c => ({ label: c.name, value: c.id }));
  const defaultOption = { label: t`no`, value: '' };
  const options = configurations.hasLoaded ? [defaultOption, ...configurationOptions] : undefined;

  return (
    <CustomSelect
      dataOptions={options}
      disabled={isDisabled}
      readOnly={readOnly && !isDisabled}
      message={errorMessage || message || loadingMessage}
      {...rest}
    />
  );
};
