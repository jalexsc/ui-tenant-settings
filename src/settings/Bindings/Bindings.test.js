import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import '../../../test/jest/__mocks__';
import withStripes from '../../../test/jest/helpers/withStripes';
import Bindings from './Bindings';

const BindingWithStripes = withStripes(Bindings, {
  resources: {
    settings: {
      hasLoaded: true,
    },
  },
});

const renderBindings = (props) => render(
  <MemoryRouter>
    <BindingWithStripes {...props} />
  </MemoryRouter>
);

describe('Bindings', () => {
  it('renders bindings', async () => {
    const { findAllByText } = await renderBindings({ label: 'binding' });
    expect(findAllByText('binding')).toBeDefined();
  });
});
