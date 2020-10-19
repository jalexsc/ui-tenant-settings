import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Col, Row, Checkbox } from '@folio/stripes/components';

class StaffSlipEditList extends React.Component {
  static propTypes = {
    staffSlips: PropTypes.arrayOf(PropTypes.object),
  };

  renderList = () => {
    const { staffSlips } = this.props;
    const items = staffSlips.map((staffSlip, index) => (
      <Row key={`staff-slip-row-${index}`}>
        <Col xs={12}>
          <Field
            component={Checkbox}
            type="checkbox"
            id={`staff-slip-checkbox-${index}`}
            label={staffSlip.name}
            name={`staffSlips[${index}]`}
          />
        </Col>
      </Row>
    ));

    return (
      <React.Fragment>
        <p>
          <FormattedMessage
            id="ui-tenant-settings.settings.servicePoints.printByDefault"
          />
        </p>
        {items}
      </React.Fragment>
    );
  }

  render() {
    return (
      <FieldArray
        data-test-staff-slip-edit-list
        name="staffSlips"
        component={this.renderList}
      />
    );
  }
}

export default StaffSlipEditList;
