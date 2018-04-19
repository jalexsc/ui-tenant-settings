import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';
import Select from '@folio/stripes-components/lib/Select';

class LocationCampuses extends React.Component {
  static contextTypes = {
    translate: PropTypes.func,
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      institutions: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      locationsPerCampus: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  static manifest = {
    institutions: {
      type: 'okapi',
      records: 'locinsts',
      path: 'location-units/institutions?query=cql.allRecords=1 sortby name',
    },
    locationsPerCampus: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
    }
  };

  constructor(props, context) {
    super(props);

    this.context = context;
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.numberOfObjectsFormatter = this.numberOfObjectsFormatter.bind(this);

    this.state = {
      institutionId: null,
    };
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.locationsPerCampus || {}).records || [];
    return records.reduce((count, loc) => {
      return loc.campusId === item.id ? count + 1 : count;
    }, 0);
  }

  onChangeInstitution = (e) => {
    this.setState({ institutionId: e.target.value });
  }


  render() {
    const options = [];
    (((this.props.resources.institutions || {}).records || []).forEach(i => {
      options.push({ value: i.id, label: `${i.name} ${i.code}` });
    }));

    if (!options.length) {
      return <div />;
    }

    return (
      <this.connectedControlledVocab
        {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
        dataKey={undefined}
        baseUrl="location-units/campuses"
        records="loccamps"
        rowFilter={<Select
          label="Institution"
          id="institutionSelect"
          name="institutionSelect"
          placeholder="Select institution"
          dataOptions={options}
          onChange={this.onChangeInstitution}
        />}
        rowFilterFunction={(row) => row.institutionId === this.state.institutionId}
        label={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.campuses.campuses' })}
        labelSingular={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.campuses.campus' })}
        objectLabel={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.locations.locations' })}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.campuses.campus' }),
          code: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.code' }),
        }}
        formatter={{ numberOfObjects: this.numberOfObjectsFormatter }}
        nameKey="group"
        id="patrongroups"
        preCreateHook={(item) => Object.assign({}, item, { institutionId: this.state.institutionId })}
      />
    );
  }
}

export default LocationCampuses;
