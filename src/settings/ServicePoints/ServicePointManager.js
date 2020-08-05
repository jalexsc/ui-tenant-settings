import { sortBy, keyBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';

import { isUndefined } from 'util';
import ServicePointDetail from './ServicePointDetail';
import ServicePointFormContainer from './ServicePointFormContainer';

class ServicePointManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'servicepoints',
      path: 'service-points?query=cql.allRecords=1 sortby name&limit=1000',
      resourceShouldRefresh: true,
      throwErrors: false,
      POST: {
        path: 'service-points'
      },
      PUT: {
        path: 'service-points'
      },
      DELETE: {
        path: 'service-points'
      }
    },
    uniquenessValidator: {
      type: 'okapi',
      records: 'servicepoints',
      accumulate: 'true',
      path: 'service-points',
      fetch: false,
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      accumulate: 'true',
      fetch: false,
    },
    staffSlips: {
      type: 'okapi',
      records: 'staffSlips',
      path: 'staff-slips-storage/staff-slips',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
      uniquenessValidator: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  parseInitialValues = (values = {}) => {
    const { resources } = this.props;
    const slipMap = keyBy(values.staffSlips, 'id');
    const slips = sortBy((resources.staffSlips || {}).records || [], '[name]');
    const staffSlips = slips.map(({ id }) => {
      const { printByDefault } = (slipMap[id] || {});
      return printByDefault || isUndefined(printByDefault);
    });

    return { ...values, staffSlips };
  }

  render() {
    let entryList = sortBy((this.props.resources.entries || {}).records || [], ['name']);
    entryList = entryList.map(item => {
      item.pickupLocation = item.pickupLocation || false;
      return item;
    });

    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        parentResources={this.props.resources}
        entryList={entryList}
        detailComponent={ServicePointDetail}
        parseInitialValues={this.parseInitialValues}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        entryFormComponent={ServicePointFormContainer}
        onSelect={this.onSelect}
        nameKey="name"
        permissions={{
          put: 'settings.tenant-settings.enabled',
          post: 'settings.tenant-settings.enabled',
          delete: 'settings.tenant-settings.enabled',
        }}
      />
    );
  }
}

export default ServicePointManager;
