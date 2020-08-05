import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Field,
} from 'react-final-form';

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
  Label,
} from '@folio/stripes/components';

import css from './Period.css';

const validateDuration = value => {
  if (typeof value !== 'number') {
    return <FormattedMessage id="ui-tenant-settings.settings.servicePoints.validation.required" />;
  }

  if (value <= 0) {
    return <FormattedMessage id="ui-tenant-settings.settings.validate.greaterThanZero" />;
  }

  return undefined;
};

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

  onSelectChange = (e) => {
    const {
      selectValuePath,
      changeFormValue,
    } = this.props;

    changeFormValue(selectValuePath, e.target.value);

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
        <Row className={css.labelRow}>
          <Col xs={12}>
            <Label className={css.label} required>
              <FormattedMessage id={fieldLabel} />
            </Label>
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
              validate={validateDuration}
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

export default Period;
