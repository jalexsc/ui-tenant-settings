import React from 'react';

import { act, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import {
  withStripes,
  renderWithRouter
} from '../../../test/jest/helpers';

import Bindings from './Bindings';

const setBindings = jest.fn();

const BindingWithStripes = withStripes(Bindings, {
  stripes: {
    setBindings,
  },
  resources: {
    settings: {
      hasLoaded: true,
      records: [{ configName: 'bindings', module: 'ORG', value: '' }],
    },
  },
});

const renderBindings = (props) => renderWithRouter(<BindingWithStripes {...props} />);

describe('Bindings', () => {
  afterEach(() => {
    setBindings.mockClear();
  });

  it('renders bindings', async () => {
    const { findAllByText } = await renderBindings({ label: 'binding' });
    expect(await findAllByText('binding')).toBeDefined();
  });

  it('fills and saves bindings', async () => {
    await act(async () => {
      await renderBindings({ label: 'binding' });
      const textarea = screen.getByRole('textbox', { name: /binding/i });
      const button = screen.getByRole('button', { type: /submit/i });

      await user.type(textarea, '{"test": "test"}');

      user.click(button);
    });

    expect(setBindings).toHaveBeenCalledTimes(1);
  });
});
