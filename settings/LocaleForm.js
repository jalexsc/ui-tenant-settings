import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';
import Pane from '@folio/stripes-components/lib/Pane';

const options = [
  { value: 'en-US', label: 'English - United States' },
  { value: 'en-GB', label: 'English - Great Britain' },
  { value: 'da-DK', label: 'Danish' },
  { value: 'de-DE', label: 'German - Germany' },
  { value: 'hu-HU', label: 'Hungarian' },
];

const LocaleForm = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    label,
  } = props;

  const lastMenu = (<Button type="submit" disabled={(pristine || submitting)}>Save</Button>);

  return (
    <form id="locale-form" onSubmit={handleSubmit}>
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={lastMenu}>
        <Row>
          <Col xs={12}>
            <label htmlFor="setting"><FormattedMessage id="ui-organization.settings.localization" /></label>
            <br />
            <Field
              component={Select}
              id="locale"
              placeholder="---"
              name="locale"
              dataOptions={options}
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

LocaleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.string,
};

export default stripesForm({
  form: 'localeForm',
  navigationCheck: true,
  enableReinitialize: true,
})(LocaleForm);
