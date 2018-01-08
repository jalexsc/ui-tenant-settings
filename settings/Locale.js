import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import Callout from '@folio/stripes-components/lib/Callout';

import LocaleForm from './LocaleForm';

class Locale extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setLocale: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      setting: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      setting: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    label: PropTypes.string.isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORG and configName=locale)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(data) {
    const value = data.locale;
    const settings = (this.props.resources.setting || {}).records || [];
    const record = settings[0];

    let promise;

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      promise = this.props.mutator.setting.PUT(omit(record, ['metadata']));
    } else {
      // No setting: create a new one
      promise = this.props.mutator.setting.POST({
        module: 'ORG',
        configName: 'locale',
        value,
      });
    }

    promise.then(() => {
      this.callout.sendCallout({ message: 'Setting was successfully updated.' });
      setTimeout(() => this.props.stripes.setLocale(value), 2000);
    });
  }

  render() {
    const localeSettings = this.props.resources.setting || {};
    const records = localeSettings.records || [];
    const locale = records.length === 0 ? '' : records[0].value;
    return (
      <div style={{ width: '100%' }}>
        <LocaleForm label={this.props.label} onSubmit={this.save} initialValues={{ locale }} />
        <Callout ref={ref => (this.callout = ref)} />
      </div>
    );
  }
}

export default Locale;
