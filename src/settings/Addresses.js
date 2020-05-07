import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { TextArea, TextField } from '@folio/stripes/components';

import css from './Addresses.css';

const moduleName = 'TENANT';
const configName = 'tenant.addresses';

const fieldComponents = {
  address: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextArea}
        fullWidth
      />
    );
  },
  name: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextField}
        fullWidth
      />
    );
  },
};

const parseRow = row => {
  const value = JSON.parse(row.value || '{}');
  return {
    name: value.name,
    address: value.address,
    ...row,
  };
};

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'address'];
const columnMapping = {
  name: <FormattedMessage id="ui-tenant-settings.settings.addresses.name" />,
  address: <FormattedMessage id="ui-tenant-settings.settings.addresses.address" />,
};
const objectLabel = <FormattedMessage id="ui-tenant-settings.settings.addresses.label" />;
const formatter = {
  address: item => (<div className={css.addressWrapper}>{item.address}</div>),
};

class Addresses extends Component {
  static manifest = Object.freeze({
    values: {
      type: 'okapi',
      path: 'configurations/entries',
      records: 'configs',
      throwErrors: false,
      clientGeneratePk: true,
      PUT: {
        path: 'configurations/entries/%{activeRecord.id}',
      },
      DELETE: {
        path: 'configurations/entries/%{activeRecord.id}',
      },
      GET: {
        params: {
          query: `(module=${moduleName} and configName=${configName})`,
          limit: '500',
        },
      },
    },
    updaterIds: [],
    activeRecord: {},
    updaters: {
      type: 'okapi',
      records: 'users',
      path: 'users',
      GET: {
        params: {
          query: (queryParams, pathComponents, resourceValues) => {
            if (resourceValues.updaterIds && resourceValues.updaterIds.length) {
              return `(${resourceValues.updaterIds.join(' or ')})`;
            }
            return null;
          },
        }
      }
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      addresses: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      values: PropTypes.object,
      updaters: PropTypes.object,
      activeRecord: PropTypes.object,
      updaterIds: PropTypes.object,
    }),
  };

  onCreate = item => ({
    value: JSON.stringify(item),
    module: moduleName,
    configName,
    code: `ADDRESS_${(new Date()).valueOf()}`,
  });

  onUpdate = item => ({
    code: item.code,
    id: item.id,
    module: item.module,
    configName: item.configName,
    value: JSON.stringify({
      name: item.name,
      address: item.address,
    }),
  });

  render() {
    return (
      <ControlledVocab
        {...this.props}
        dataKey={undefined}
        baseUrl="configurations/entries"
        records="configs"
        parseRow={parseRow}
        label={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.addresses.label' })}
        labelSingular={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.addresses.address' })}
        objectLabel={objectLabel}
        visibleFields={visibleFields}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        fieldComponents={fieldComponents}
        nameKey="name"
        id="addresses"
        sortby="name"
        preCreateHook={this.onCreate}
        preUpdateHook={this.onUpdate}
        formatter={formatter}
      />
    );
  }
}

export default injectIntl(Addresses);
