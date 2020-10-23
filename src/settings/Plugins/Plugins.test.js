import React from 'react';

import { act, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import {
  stripesConnect,
  renderWithRouter,
} from '../../../test/jest/helpers';

import Plugins from './Plugins';

const setSinglePlugin = jest.fn();

const ConnectedPlugins = stripesConnect(Plugins, {
  stripes: {
    setSinglePlugin,
  },
});

const renderPlugins = (props) => renderWithRouter(<ConnectedPlugins {...props} />);

describe('Plugins', () => {
  afterEach(() => {
    setSinglePlugin.mockClear();
  });

  it('renders plugins', async () => {
    const { findAllByText } = await renderPlugins({ label: 'plugins' });
    expect(await findAllByText('plugins')).toBeDefined();
  });

  it('chooses and saves plugin', async () => {
    await act(async () => {
      await renderPlugins({ label: 'plugins' });
      const button = screen.getByRole('button', { type: /submit/i });

      user.selectOptions(screen.getByTestId('find-instance'), ['@folio/plugin-find-instance']);
      user.click(button);
    });

    expect(setSinglePlugin).toHaveBeenCalledTimes(1);
  });
});
