import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { sortBy, cloneDeep, findIndex } from 'lodash';
import {
  Icon,
  Layout,
  RadioButton,
  RepeatableField,
  Select,
} from '@folio/stripes/components';
import css from './ServicePointsFields.css';

const omitUsedOptions = (list, usedValues, key, id) => {
  const unUsedValues = cloneDeep(list);
  if (usedValues) {
    usedValues.forEach((item, index) => {
      if (id !== index && item) {
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
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.singlePrimary = this.singlePrimary.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.radioButtonComp = this.radioButtonComp.bind(this);
    this.list = {};
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
    this.list = omitUsedOptions(this.props.servicePoints, values.servicePointIds, 'selectSP', index);
    const sortedList = sortBy(this.list, ['label']);
    const options = [{ label: 'Select service point', value: '' }, ...sortedList];
    return (
      <Layout className={`flex ${css.fieldsLayout}`} key={index}>
        <Layout className={`display-flex ${css.selectLayout}`}>
          <Field
            component={Select}
            name={`${field}.selectSP`}
            id="servicePointSelect"
            dataOptions={options}
            className={css.selectField}
            marginBottom0
          />
        </Layout>
        <Layout className={`display-flex ${css.radioButtonLayout}`}>
          <Field
            component={this.radioButtonComp}
            fieldIndex={index}
            name={`${field}.primary`}
          />
        </Layout>
      </Layout>
    );
  }

  render() {
    const { values } = this.context._reduxForm;

    // make the last existing service point to be the primary one
    if (values.servicePointIds && values.servicePointIds.length === 1 && !values.servicePointIds[0].primary) {
      this.singlePrimary(0);
    }

    const legend = (
      <Layout className="display-flex">
        <Layout className={`${css.label} ${css.servicePointsLabel}`}>
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints" />
          <span className={css.asterisk}>*</span>
        </Layout>
        <Layout className={`${css.label} ${css.primaryLabel}`}>
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.primary" />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <FieldArray
          addLabel={
            Object.keys(this.list).length > 1 ?
              <Icon icon="plus-sign">Add service point</Icon> :
              ''
          }
          legend={legend}
          emptyMessage={<span className={css.emptyMessage}>Location must have at least one service point</span>}
          component={RepeatableField}
          name="servicePointIds"
          renderField={this.renderFields}
        />
      </React.Fragment>
    );
  }
}

export default ServicePointsFields;
