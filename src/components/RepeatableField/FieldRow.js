import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Icon,
  Layout,
  omitProps,
  Row,
  SRStatus
} from '@folio/stripes/components';
import css from './RepeatableField.css';

const FieldRowPropTypes = {
  addButtonId: PropTypes.string,
  addDefault: PropTypes.func,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.node,
  containerRef: PropTypes.func,
  fields: PropTypes.object,
  formatter: PropTypes.func,
  label: PropTypes.node,
  lastRowRef: PropTypes.func,
  newItemTemplate: PropTypes.object,
  onAddField: PropTypes.func,
  template: PropTypes.arrayOf(PropTypes.object),
};

class FieldRow extends React.Component {
  constructor(props) {
    super(props);

    this.refIfLastRow = this.refIfLastRow.bind(this);
    this.renderControl = this.renderControl.bind(this);
    this.addButton = null;
    this.srstatus = null;
    this.action = null;
    this.buttonEl = React.createRef();
    this.addButtonId = this.props.addButtonId || uniqueId(`${this.props.label}AddButton`);
  }

  componentDidMount() {
    if (this.props.fields.length === 0 && this.props.addDefaultItem) {
      setTimeout(() => { this.props.addDefault(this.props.fields); }, 5);
    }
  }

  componentDidUpdate() {
    const {
      fields,
      label
    } = this.props;

    if (this.action) {
      if (this.action.type === 'add') {
        this.srstatus.sendMessage(
          `added new ${label} field. ${fields.length} ${label} total`
        );
        this.action = null;
      }
      if (this.action.type === 'remove') {
        const { item } = this.action;
        let contextualSpeech;
        if (typeof item === 'string') {
          contextualSpeech = this.action.item;
        } else if (typeof item === 'object') {
          const valueArray = [];
          // eslint-disable-next-line no-unused-vars
          for (const key in item) {
            if (typeof item[key] === 'string' && item[key].length < 25) {
              valueArray.push(item[key]);
            }
          }
          if (valueArray.length > 0) {
            contextualSpeech = valueArray.join(' ');
          } else {
            contextualSpeech = this.action.index;
          }
        }
        this.srstatus.sendMessage(
          `${label} ${contextualSpeech} has been removed. ${fields.length} ${label} total`
        );
        this.action = null;
        setTimeout(() => this.buttonEl.current.focus());
      }
    }
  }

  handleRemove(index, item) {
    this.action = { type: 'remove', item, index };
    this.props.fields.remove(index);
  }

  handleAdd() {
    this.action = { type: 'add' };
  }

  refIfLastRow(ref, index) {
    const { fields } = this.props;
    if (index === fields.length - 1) {
      this.lastRow = ref;
      this.props.lastRowRef(ref);
    }
  }

  renderControl(fields, field, fieldIndex, template, templateIndex) {
    if (template.render) {
      return template.render({ fields, field, fieldIndex, templateIndex });
    }

    const { name, label, ...rest } = omitProps(template, ['component', 'render']);
    const labelProps = {};
    if (fieldIndex === 0) {
      labelProps.label = label;
    } else {
      labelProps['aria-label'] = `${label} ${fieldIndex}`;
    }

    return (
      <Field
        name={name ? `${fields.name}[${fieldIndex}].${name}` : `${fields.name}[${fieldIndex}]`}
        component={this.props.formatter}
        templateIndex={templateIndex}
        id={uniqueId(field)}
        fullWidth
        {...labelProps}
        data-key={fieldIndex}
        {...rest}
      />
    );
  }

  render() {
    const { fields } = this.props;
    let addLabel = <FormattedMessage id="stripes-components.addNewField" values={{ item: this.props.label }} />;
    if (this.props.addLabel) {
      addLabel = this.props.addLabel;
    }

    if (this.props.fields.length === 0 && !this.props.addDefaultItem) {
      return (
        <div ref={this.props.containerRef}>
          <SRStatus ref={(ref) => { this.srstatus = ref; }} />
          <fieldset>
            <legend id={this._arrayId} className={css.RFLegend}>{this.props.label}</legend>
            <Row>
              <Col xs={12} sm={8}>
                <Row>
                  <Col xs={10}>
                    <Button
                      fullWidth
                      className={css.addButton}
                      onClick={() => { this.props.onAddField(fields); }}
                      id={this.addButtonId}
                      ref={this.buttonEl}
                    >
                      {this.props.addLabel ?
                        this.props.addLabel :
                        <Icon icon="plus-sign">
                          {`Add ${this.props.label}`}
                        </Icon>
                      }
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </fieldset>
        </div>
      );
    }
    return (
      <div ref={this.props.containerRef}>
        <SRStatus ref={(ref) => { this.srstatus = ref; }} />
        <fieldset>
          <legend id={this._arrayId} className={css.RFLegend}>{this.props.label}</legend>

          {fields.map((f, fieldIndex) => (
            <div
              key={`${this.props.label}-${fieldIndex}`}
              className={css.fullWidth}
              ref={(ref) => { this.refIfLastRow(ref, fieldIndex); }}
            >
              <Row bottom="xs">
                <Col xs={12} sm={8}>
                  <Row>
                    <Col xs={10}>
                      <Row>
                        {this.props.template.map((t, i) => (
                          <Col xs key={`field-${i}`}>
                            {this.renderControl(fields, f, fieldIndex, t, i)}
                          </Col>
                        ))}
                      </Row>
                    </Col>
                    <Col xs={2}>
                      <Layout className={fieldIndex === 0 ? 'marginTopLabelSpacer' : ''}>
                        <FormattedMessage id="stripes-components.removeFields" values={{ item: this.props.label, num: fieldIndex + 1 }}>
                          {ariaLabel => (
                            <Button
                              buttonStyle="link"
                              className={css.linkButton}
                              onClick={() => { this.handleRemove(fieldIndex, f); }}
                              ariaLabel={ariaLabel}
                            >
                              <Icon icon="trash" />
                            </Button>
                          )}
                        </FormattedMessage>
                      </Layout>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={4}>
                  {fieldIndex === fields.length - 1 &&
                    <Button
                      fullWidth
                      className={css.addButton}
                      onClick={() => { this.props.onAddField(fields); }}
                      id={this.addButtonId}
                    >
                      {addLabel}
                    </Button>
                  }
                </Col>
              </Row>
            </div>
          ))}
        </fieldset>
      </div>
    );
  }
}

FieldRow.propTypes = FieldRowPropTypes;

export default FieldRow;
