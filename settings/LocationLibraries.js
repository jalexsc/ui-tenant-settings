import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';
import Select from '@folio/stripes-components/lib/Select';

class LocationLibraries extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
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
      accumulate: true,
    },
  });

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
    const { formatMessage } = this.props.stripes.intl;

    const institutions = [];
    (((this.props.resources.institutions || {}).records || []).forEach(i => {
      institutions.push({ value: i.id, label: `${i.name}${i.code ? ` (${i.code})` : ''}` });
    }));

    if (!institutions.length) {
      return <div />;
    }

    const campuses = [];
    ((this.props.resources.campuses || {}).records || []).forEach(i => {
      if (i.institutionId === this.state.institutionId) {
        campuses.push({ value: i.id, label: `${i.name}${i.code ? ` (${i.code})` : ''}` });
      }
    });

    const formatter = {
      numberOfObjects: this.numberOfObjectsFormatter,
    };

    const filterBlock = (
      <div>
        <Select
          label={formatMessage({ id: 'ui-organization.settings.location.institutions.institution' })}
          id="institutionSelect"
          name="institutionSelect"
          dataOptions={[{ label: formatMessage({ id: 'ui-organization.settings.location.institutions.selectInstitution' }), value: '' }, ...institutions]}
          onChange={this.onChangeInstitution}
        />
        {this.state.institutionId && <Select
          label={formatMessage({ id: 'ui-organization.settings.location.campuses.campus' })}
          id="campusSelect"
          name="campusSelect"
          dataOptions={[{ label: formatMessage({ id: 'ui-organization.settings.location.campuses.selectCampus' }), value: '' }, ...campuses]}
          onChange={this.onChangeCampus}
        />}
      </div>
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
        rowFilterFunction={(row) => row.campusId === this.state.campusId}
        label={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.libraries' })}
        labelSingular={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.libraries.library' })}
        objectLabel={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.locations' })}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.libraries.library' }),
          code: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.code' }),
        }}
        formatter={formatter}
        nameKey="group"
        id="libraries"
        preCreateHook={(item) => Object.assign({}, item, { campusId: this.state.campusId })}
        listSuppressor={() => !(this.state.institutionId && this.state.campusId)}
        listSuppressorText={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.libraries.missingSelection' })}
      />
    );
  }
}

export default LocationLibraries;
