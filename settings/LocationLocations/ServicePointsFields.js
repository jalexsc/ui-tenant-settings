import React from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { sortBy, cloneDeep, findIndex } from 'lodash';
import { Select, RadioButton, RepeatableField, Layout, Row, Col } from '@folio/stripes/components';
import css from './ServicePointsFields.css';

const omitUsedOptions = (list, usedValues, key, id) => {
  const unUsedValues = cloneDeep(list);
  if (usedValues) {
    usedValues.forEach((item, index) => {
      if (id !== index) {
        const usedValueIndex = findIndex(unUsedValues, v => {
          return v.label === item[key];
        });
        if (usedValueIndex !== -1) {
          unUsedValues.splice(usedValueIndex, 1);
        }
      }
    });
  }
  return unUsedValues;
};

class ServicePointsFields extends React.Component {
  static propTypes = {
    servicePoints: PropTypes.arrayOf(PropTypes.object),
    translate: PropTypes.func,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.singlePrimary = this.singlePrimary.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.radioButtonComp = this.radioButtonComp.bind(this);
  }

  singlePrimary(id) {
    const { values, dispatch, change } = this.context._reduxForm;
    values.servicePointIds.forEach((a, i) => {
      if (i === id) {
        dispatch(change(`servicePointIds[${i}].primary`, true));
      } else {
        dispatch(change(`servicePointIds[${i}].primary`, false));
      }
    });
  }

  radioButtonComp({ input, ...props }) {
    return (
      <RadioButton
        onChange={() => { this.singlePrimary(props.fieldIndex); }}
        checked={input.value}
        name={input.name}
        aria-label={`servicePoint use as primary ${props.fieldIndex}`}
      />
    );
  }

  renderFields(field, index) {
    const { values } = this.context._reduxForm;
    const list = omitUsedOptions(this.props.servicePoints, values.servicePointIds, 'selectSP', index);
    const sortedList = sortBy(list, ['label']);
    const options = [{ label: 'Select service point', value: '' }, ...sortedList];
    return (
      <Row key={index} style={{ marginBottom:'-30px' }}>
        <Layout style={{ marginLeft:'8px', width:'180px' }} className="marginTopLabelSpacer">
          <Field
            component={Select}
            name={`${field}.selectSP`}
            id="servicePointSelect"
            dataOptions={options}
          />
        </Layout>
        <Layout style={{ marginLeft:'15px', marginRight:'40px' }} className="marginTopLabelSpacer">
          <Field
            component={this.radioButtonComp}
            fieldIndex={index}
            name={`${field}.primary`}
          />
        </Layout>
      </Row>
    );
  }

  render() {
    const { values } = this.context._reduxForm;

    // make the last existing service point to be the primary one
    if (values.servicePointIds && values.servicePointIds.length === 1 && !values.servicePointIds[0].primary) {
      this.singlePrimary(0);
    }

    const marginBottom = (values.servicePointIds && values.servicePointIds.length) === 0 ? '34px' : '0px';
    return (
      <React.Fragment>
        <Layout style={{ marginBottom }}>
          <Row className={css.label} style={{ marginBottom:'-35px' }}>
            <Col xs={3}>
              {`${this.props.translate('locations.servicePoints')} *`}
            </Col>
            <Col xs={2} style={{ marginLeft:'-35px' }}>
              {`${this.props.translate('locations.primary')}`}
            </Col>
          </Row>
        </Layout>
        <FieldArray
          addLabel="+ Add service point"
          rerenderOnEveryChange
          component={RepeatableField}
          name="servicePointIds"
          renderField={this.renderFields}
        />
      </React.Fragment>
    );
  }
}

export default ServicePointsFields;
