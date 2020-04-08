import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

const type = 'Location';

const LocationInUseModal = ({ toggleModal }) => {
  return (
    <Modal
      open
      label={<FormattedMessage id="stripes-smart-components.cv.cannotDeleteTermHeader" values={{ type }} />}
      size="small"
    >
      <Row>
        <Col xs>
          <FormattedMessage id="stripes-smart-components.cv.cannotDeleteTermMessage" values={{ type }} />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Button
            buttonStyle="primary"
            onClick={toggleModal}
          >
            <FormattedMessage id="stripes-core.label.okay" />
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

LocationInUseModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default LocationInUseModal;
