
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (children) => render(
  <MemoryRouter>{children}</MemoryRouter>
);

export default renderWithRouter;
