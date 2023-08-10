import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import GroupCardsView from './GroupCardsView';

jest.mock(
  '@eeacms/volto-freshwater-policy/components/Blocks/CustomBlockTemplates/VoltoBlockImageCards',
  () => ({
    Card: (props) => {
      return <div>{props.card.title}</div>;
    },
  }),
);

describe('GroupCardsView', () => {
  it('should render a group of cards', () => {
    const mockCards = [
      {
        '@id': '/card/1',
        title: 'Card 1',
      },
      {
        '@id': '/card/2',
        title: 'Card 2',
      },
    ];

    const { getByText } = render(
      <GroupCardsView
        cards={mockCards}
        border_color="red"
        image_height="200px"
        image_scale={1}
        cards_per_row={3}
        editable={false}
        display="default"
      />,
    );

    expect(getByText('Card 1')).toBeInTheDocument();
    expect(getByText('Card 2')).toBeInTheDocument();
  });

  it('should render without cards', () => {
    const { queryByTestId } = render(
      <GroupCardsView
        cards={[]}
        border_color="blue"
        image_height="150px"
        image_scale={0.8}
        cards_per_row={2}
        editable={true}
        display="list"
      />,
    );

    const cardItems = queryByTestId('card-item');
    expect(cardItems).not.toBeInTheDocument();
  });
});
