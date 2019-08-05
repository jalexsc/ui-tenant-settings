import {
  interactor,
  clickable,
} from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

const createControlSelectorByIndex = index => `[class*=editListRow] > div:nth-child(${index})`;

@interactor class Institutions {
  static defaultScope = '#institutions';

  newButton = clickable('#clickable-add-institutions');
  nameField = new TextFieldInteractor(createControlSelectorByIndex(1));
  codeField = new TextFieldInteractor(createControlSelectorByIndex(2));
}

export default Institutions;
