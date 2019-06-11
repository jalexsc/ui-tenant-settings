import {
  clickable,
  collection,
  interactor,
  text,
} from '@bigtest/interactor';

// eslint-disable-next-line import/no-extraneous-dependencies
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

@interactor class LanguageAndLocalization {
  title = text('#config-form [class*=paneTitle---]');
  settings = collection('[class*=row--]', SelectInteractor);
  save = clickable('#clickable-save-config');
  selectLocale = new SelectInteractor('#select-locale');
  selectTimeZone = new SelectInteractor('#select-timezone');
  selectCurrency = new SelectInteractor('#select-currency');
}

export default LanguageAndLocalization;
