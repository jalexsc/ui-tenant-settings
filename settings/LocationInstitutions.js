import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class LocationInstitutions extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      locationsPerInstitution: PropTypes.object,
    }).isRequired,
  };

  static manifest = Object.freeze({
    locationsPerInstitution: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
    },
  });

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.numberOfObjectsFormatter = this.numberOfObjectsFormatter.bind(this);
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.locationsPerInstitution || {}).records || [];
    return records.reduce((count, loc) => {
      return loc.institutionId === item.id ? count + 1 : count;
    }, 0);
  }

  render() {
    const formatter = {
      numberOfObjects: this.numberOfObjectsFormatter,
    };

    return (
      <this.connectedControlledVocab
        {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
        dataKey={undefined}
        baseUrl="location-units/institutions?query=cql.allRecords=1 sortby name"
        records="locinsts"
        label={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.institutions.institutions' })}
        labelSingular={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.institutions.institution' })}
        objectLabel={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.locations.locations' })}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.institutions.institution' }),
          code: this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.code' }),
        }}
        formatter={formatter}
        nameKey="name"
        id="institutions"
      />
    );
  }
}

export default LocationInstitutions;
