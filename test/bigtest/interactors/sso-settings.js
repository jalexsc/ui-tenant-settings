import {
  clickable,
  interactor,
  text,
  isPresent,
} from '@bigtest/interactor';

// eslint-disable-next-line import/no-extraneous-dependencies
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor class SsoSettings {
  title = text('#form-saml [class*=paneTitle---]');
  save = clickable('button[type="submit"]');
  isLoaded = isPresent('#samlconfig_idpUrl');
  isDownloadMetadataPresent = isPresent('#download-metadata-button');
  isDownloadMetadataDisabled = isPresent('button:disabled');

  idpUrl = new TextFieldInteractor('#fill_idpUrl');
  binding = new SelectInteractor('#select_samlBinding');
  attribute = new TextFieldInteractor('#fill_attribute');
  userProperty = new SelectInteractor('#select_userProperty');
  feedbackError = text('[class*=feedbackError---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default SsoSettings;
