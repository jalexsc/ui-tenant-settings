import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const DisallowDeleteModal = (props) => {
  const footer = (
    <ModalFooter>
      <Button
        id="clickable-disallow-remove"
        buttonStyle="primary"
        onClick={props.onCancel}
        data-test-clickable-disallow-remove-button
      >
        <FormattedMessage id="ui-tenant-settings.settings.servicePoints.ok" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={props.open}
      label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.disallowDeleteServicePoint" />}
      scope="module"
      size="small"
      footer={footer}
    >
      <p>
        <FormattedMessage id="ui-tenant-settings.settings.servicePoints.disallowDeleteServicePointMessage" />
      </p>
    </Modal>
  );
};

DisallowDeleteModal.propTypes = propTypes;

export default DisallowDeleteModal;
