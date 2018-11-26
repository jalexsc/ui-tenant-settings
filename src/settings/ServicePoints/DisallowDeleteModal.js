import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalFooter
} from '@folio/stripes/components';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const DisallowDeleteModal = (props) => {
  const footer = (
    <ModalFooter
      primaryButton={{
        'label': <FormattedMessage id="ui-organization.settings.servicePoints.ok" />,
        'onClick': props.onCancel,
        'id': 'clickable-disallow-remove',
        'buttonStyle': 'primary',
        'data-test-clickable-disallow-remove-button': true,
      }}
    />
  );

  return (
    <Modal
      open={props.open}
      label={<FormattedMessage id="ui-organization.settings.servicePoints.disallowDeleteServicePoint" />}
      scope="module"
      size="small"
      footer={footer}
    >
      <p>
        <FormattedMessage id="ui-organization.settings.servicePoints.disallowDeleteServicePointMessage" />
      </p>
    </Modal>
  );
};

DisallowDeleteModal.propTypes = propTypes;

export default DisallowDeleteModal;
