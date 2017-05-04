// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import Select from '@folio/stripes-components/lib/Select';


const options = [
  { value: 'en_US', label: 'English - United States' },
  { value: 'en_UK', label: 'English - United Kingdom' },
  { value: 'da_DK', label: 'Danish' },
];


class Locale extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      setting: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORG and config_name=locale)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/${recordId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
  }

  changeSetting(e) {
    const value = e.target.value;
    this.props.stripes.logger.log('action', `changing locale to ${value}`);
    const record = this.props.data.setting[0];

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      this.props.mutator.setting.PUT(record);
    } else {
      // No setting: create a new one
      this.props.mutator.setting.POST({
        module: 'ORG',
        config_name: 'locale',
        value: value,
      });
    }
  }

  render() {
    const settings = this.props.data.setting || [];
    const value = (settings.length === 0) ? '' : settings[0].value;

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Language and localization">
        <Row>
          <Col xs={12}>
            <label htmlFor="setting">Select locale for rendering dates, etc.</label>
            <br />
            <Select
              id="setting"
              placeholder="---"
              value={value}
              dataOptions={options}
              onChange={this.changeSetting}
            />
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Locale;
