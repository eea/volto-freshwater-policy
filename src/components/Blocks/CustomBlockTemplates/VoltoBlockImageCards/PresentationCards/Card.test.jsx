import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from './Card';

window.URL.createObjectURL = jest.fn(() => 'test');
jest.mock('@eeacms/volto-freshwater-policy/components', () => ({
  ItemMetadataSnippet: () => <div>test</div>,
  ItemTitle: () => <div>test</div>,
  ItemMetadata: () => <div>test</div>,
}));

describe('Card', () => {
  it('should render card with title and description', () => {
    const mockCard = {
      title: 'Mock Card Title',
      description: 'Mock Card Description',
    };

    const { getByText } = render(<Card card={mockCard} />);

    expect(getByText('Mock Card Title')).toBeInTheDocument();
    expect(getByText('Mock Card Description')).toBeInTheDocument();
  });

  it('should open modal with metadata when clicked', () => {
    const mockCard = {
      title: 'Mock Card Title',
      description: 'Mock Card Description',
      source: [
        {
          '@id': '/mock/item',
          lead_image: 'mock_image_url',
        },
      ],
    };

    const { container, getByText } = render(
      <Card card={mockCard} display="metadata_cards" />,
    );

    fireEvent.click(container.querySelector('.ui.card.presentation-card'));
    expect(getByText('Mock Card Title')).toBeInTheDocument();
    expect(getByText('Mock Card Description')).toBeInTheDocument();
  });
});
