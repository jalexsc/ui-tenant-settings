import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  change,
  Field,
} from 'redux-form';

import {
  get,
  isEmpty,
  isNumber,
} from 'lodash';

import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import css from './Period.css';

const required = value => (value || typeof value === 'number' ? undefined : <FormattedMessage id="ui-organization.settings.servicePoints.validation.required" />);
const minValue1 = value => (value <= 1 ? <FormattedMessage id="ui-organization.settings.validate.greaterThanOne" /> : undefined);

class Period extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    selectPlaceholder: PropTypes.string.isRequired,
    inputValuePath: PropTypes.string.isRequired,
    selectValuePath: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    intervalPeriods: PropTypes.arrayOf(PropTypes.object),
    changeFormValue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  onInputBlur = () => {
    const {
      inputValuePath,
      selectValuePath,
      entity,
      changeFormValue,
    } = this.props;

    const inputValue = get(entity, inputValuePath);

    if (isNumber(inputValue)) {
      return;
    }

    changeFormValue(selectValuePath, '');
  };

  onInputClear = () => {
    const {
      inputValuePath,
      changeFormValue,
    } = this.props;

    changeFormValue(inputValuePath, '');
  };

  onSelectChange = () => {
    this.inputRef.current.focus();
  };

  transformInputValue = (value) => {
    if (isEmpty(value)) {
      return '';
    }

    return Number(value);
  };

  generateOptions = () => {
    const {
      intervalPeriods,
      selectValuePath,
    } = this.props;

    return intervalPeriods.map(({ value, label }) => (
      <option value={value} key={`${selectValuePath}-${value}`}>
        {label}
      </option>
    ));
  };

  render() {
    const {
      fieldLabel,
      selectPlaceholder,
      inputValuePath,
      selectValuePath,
    } = this.props;

    return (
      <React.Fragment>
        <Row className={css.label}>
          <Col xs={12}>
            <FormattedMessage id={fieldLabel} />
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <Field
              data-test-period-duration
              type="number"
              name={inputValuePath}
              component={TextField}
              withRef
              inputRef={this.inputRef}
              onBlur={this.onInputBlur}
              onClearField={this.onInputClear}
              parse={this.transformInputValue}
              validate={[required, minValue1]}
            />
          </Col>
          <Col xs={2}>
            <FormattedMessage id={selectPlaceholder}>
              {placeholder => (
                <Field
                  data-test-period-interval
                  name={selectValuePath}
                  component={Select}
                  placeholder={placeholder}
                  onChange={this.onSelectChange}
                >
                  {this.generateOptions()}
                </Field>
              )}
            </FormattedMessage>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  changeFormValue: (field, value) => dispatch(change('servicePointForm', field, value)),
});

export default connect(null, mapDispatchToProps)(Period);
