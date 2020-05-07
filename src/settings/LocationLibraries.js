import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { get } from 'lodash';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';

import composeValidators from '../util/composeValidators';
import locationCodeValidator from './locationCodeValidator';

class LocationLibraries extends React.Component {
  static manifest = Object.freeze({
    institutions: {
      type: 'okapi',
      records: 'locinsts',
      path: 'location-units/institutions?query=cql.allRecords=1 sortby name&limit=100',
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      records: 'loccamps',
      path: 'location-units/campuses?query=cql.allRecords=1 sortby name&limit=100',
      accumulate: true,
    },
    locationsPerLibrary: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '500',
      },
      accumulate: true,
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      locationsPerLibrary: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      institutions: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      campuses: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      locationsPerLibrary: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.numberOfObjectsFormatter = this.numberOfObjectsFormatter.bind(this);

    this.state = {
      institutionId: null,
      campusId: null,
    };
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    ['institutions', 'campuses', 'locationsPerLibrary'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.locationsPerLibrary || {}).records || [];
    return records.reduce((count, loc) => {
      return loc.libraryId === item.id ? count + 1 : count;
    }, 0);
  }

  onChangeInstitution = (e) => {
    this.setState({ institutionId: e.target.value, campusId: null });
  }

  onChangeCampus = (e) => {
    this.setState({ campusId: e.target.value });
  }

  render() {
    const { institutionId, campusId } = this.state;
    const { resources } = this.props;

    const institutions = get(resources, 'institutions.records', []).map(i => (
      <option value={i.id} key={i.id}>
        {i.name}
        {i.code ? ` (${i.code})` : ''}
      </option>
    ));

    if (!institutions.length) {
      return <div />;
    }

    const campuses = [];

    get(resources, 'campuses.records', []).forEach(c => {
      if (c.institutionId === institutionId) {
        campuses.push(
          <option value={c.id} key={c.id}>
            {c.name}
            {c.code ? ` (${c.code})` : ''}
          </option>
        );
      }
    });

    const formatter = {
      numberOfObjects: this.numberOfObjectsFormatter,
    };

    const filterBlock = (
      <React.Fragment>
        <Select
          label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
          id="institutionSelect"
          name="institutionSelect"
          onChange={this.onChangeInstitution}
        >
          <FormattedMessage id="ui-tenant-settings.settings.location.institutions.selectInstitution">
            {selectText => (
              <option>{selectText}</option>
            )}
          </FormattedMessage>
          {institutions}
        </Select>
        {institutionId &&
          <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
            id="campusSelect"
            name="campusSelect"
            onChange={this.onChangeCampus}
          >
            <FormattedMessage id="ui-tenant-settings.settings.location.campuses.selectCampus">
              {selectText => (
                <option>{selectText}</option>
              )}
            </FormattedMessage>
            {campuses}
          </Select>
        }
      </React.Fragment>
    );

    return (
      <this.connectedControlledVocab
        {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
        dataKey={undefined}
        baseUrl="location-units/libraries"
        records="loclibs"
        rowFilter={filterBlock}
        rowFilterFunction={(row) => row.campusId === campusId}
        label={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.libraries' })}
        labelSingular={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.library' })}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.locations" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={formatter}
        nameKey="group"
        id="libraries"
        preCreateHook={(item) => Object.assign({}, item, { campusId })}
        listSuppressor={() => !(institutionId && campusId)}
        listSuppressorText={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.missingSelection" />}
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
      />
    );
  }
}

export default injectIntl(LocationLibraries);
