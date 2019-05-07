import { keyBy, isUndefined } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { List, KeyValue } from '@folio/stripes/components';

class StaffSlipList extends React.Component {
  static propTypes = {
    staffSlips: PropTypes.arrayOf(PropTypes.object),
    servicePoint: PropTypes.object,
  };

  renderItem = (staffSlip, slipMap) => {
    const { id, name } = staffSlip;
    const { printByDefault } = (slipMap[id] || {});
    const yesNo = (printByDefault || isUndefined(printByDefault)) ? 'yes' : 'no';

    return (
      <li key={name}>
        <FormattedMessage
          id={`ui-tenant-settings.settings.servicePoints.printSlip.${yesNo}`}
          values={{ name }}
        />
      </li>
    );
  }

  render() {
    const { staffSlips, servicePoint } = this.props;
    const slipMap = keyBy(servicePoint.staffSlips, 'id');

    if (!staffSlips.length) return null;

    return (
      <KeyValue
        label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.printByDefault" />}
      >
        <div data-test-staff-slip-list>
          <List
            items={staffSlips}
            itemFormatter={staffSlip => this.renderItem(staffSlip, slipMap)}
          />
        </div>
      </KeyValue>
    );
  }
}

export default StaffSlipList;
