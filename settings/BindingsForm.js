import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import TextArea from '@folio/stripes-components/lib/TextArea';
import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';
import Pane from '@folio/stripes-components/lib/Pane';

function validate(values) {
  const errors = {};

  try {
    JSON.parse(values.bindings);
  } catch (error) {
    errors.bindings = error.message;
  }

  return errors;
}

class BindingsForm extends React.Component {

  getLastMenu() {
    const { pristine, submitting } = this.props;
    return (<Button type="submit" disabled={(pristine || submitting)}>Save</Button>);
  }

  render() {
    const { handleSubmit, label } = this.props;

    return (
      <form id="bindings-form" onSubmit={handleSubmit}>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={this.getLastMenu()}>
          <Row>
            <Col xs={12}>
              <label htmlFor="setting"><FormattedMessage id="ui-organization.settings.keyBindings" /></label>
              <p>Provide bindings for {
                this.context.stripes.actionNames.map(name => <span key={name}><tt>{name}</tt>, </span>)
              }</p>
              <p>
                <a href="https://github.com/folio-org/ui-organization/blob/master/settings/example-key-bindings.json">[example]</a>
              </p>
              <br />
              <Field
                label={label}
                component={TextArea}
                name="bindings"
                id="bindings"
                fullWidth
                rows="12"
              />
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

BindingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.string,
};

BindingsForm.contextTypes = {
  stripes: PropTypes.object.isRequired,
};

export default stripesForm({
  form: 'bindingsForm',
  validate,
  navigationCheck: true,
  enableReinitialize: true,
})(BindingsForm);
