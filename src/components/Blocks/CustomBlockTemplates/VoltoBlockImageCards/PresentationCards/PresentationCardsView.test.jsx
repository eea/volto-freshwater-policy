import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PresentationCardsView from './PresentationCardsView';

jest.mock(
  '@eeacms/volto-freshwater-policy/components/Blocks/CustomBlockTemplates/VoltoBlockImageCards',
  () => ({
    CarouselCardsView: (props) => {
      return (
        <div>
          {props.cards.map((card) => {
            const cardTitle = card.title
              ? card.title
              : card.source?.[0]?.title || '';
            const cardDescription =
              card.text || card.source?.[0]?.Description || '';

            return (
              <div key={card['@id']}>
                <div>{cardTitle}</div>
                <div>{cardDescription}</div>
              </div>
            );
          })}
        </div>
      );
    },
    GroupCardsView: (props) => {
      return (
        <div>
          {props.cards.map((card) => {
            const cardTitle = card.title
              ? card.title
              : card.source?.[0]?.title || '';
            const cardDescription =
              card.text || card.source?.[0]?.Description || '';

            return (
              <div key={card['@id']}>
                <div>{cardTitle}</div>
                <div>{cardDescription}</div>
              </div>
            );
          })}
        </div>
      );
    },
  }),
);

jest.mock('@plone/volto/helpers', () => ({
  BodyClass: ({ className }) => <div className={className} />,
}));

jest.mock('@plone/volto-slate/editor/render', () => ({
  serializeNodes: (nodes) => nodes,
}));

jest.mock('semantic-ui-react', () => ({
  Message: ({ children }) => <div>{children}</div>,
}));

describe('PresentationCards', () => {
  it('should render cards when data is provided', () => {
    const mockCards = [
      {
        '@id': '/card/1',
        title: 'Card 1',
        text: 'Card1 text',
      },
      {
        '@id': '/card/2',
        title: 'Card 2',
        text: 'Card2 text',
      },
    ];

    const { getByText } = render(
      <PresentationCardsView data={{ cards: mockCards }} editable={false} />,
    );

    expect(getByText('Card 1')).toBeInTheDocument();
    expect(getByText('Card 2')).toBeInTheDocument();
  });

  it('should render cards and apply useEffect when data is provided', () => {
    const mockCards = [
      {
        '@id': '/card/1',
        source: [
          {
            title: 'Card 1 Title',
            Description: 'Card 1 Description',
            getURL: '/card/1-url',
            Type: 'CardType1',
          },
        ],
      },
      {
        '@id': '/card/2',
      },
    ];

    const { getByText } = render(
      <PresentationCardsView data={{ cards: mockCards }} editable={false} />,
    );

    expect(getByText('Card 1 Title')).toBeInTheDocument();
    expect(getByText('Card 1 Description')).toBeInTheDocument();
  });

  it('should render a message when no cards are provided', () => {
    const { getByText } = render(
      <PresentationCardsView data={{ cards: [] }} editable={true} />,
    );

    expect(getByText('No image cards')).toBeInTheDocument();
  });

  it('should render title and description with specific classes', () => {
    const mockCards = [
      {
        '@id': '/card/1',
      },
    ];

    const { getByText } = render(
      <PresentationCardsView
        data={{
          cards: mockCards,
          title: 'Test Title',
          text: 'Test Description',
        }}
        editable={false}
      />,
    );

    expect(getByText('Test Title')).toHaveClass(
      'presentation-cards-grid-title',
    );
    expect(getByText('Test Description')).toHaveClass(
      'presentation-cards-grid-description',
    );
  });

  it('should render CarouselCardsView', () => {
    const mockCards = [
      {
        '@id': '/card/1',
        source: [
          {
            title: 'Card 1 Title',
            Description: 'Card 1 Description',
            getURL: '/card/1-url',
            Type: 'CardType1',
          },
        ],
      },
      {
        '@id': '/card/2',
      },
    ];
    const { getByText } = render(
      <PresentationCardsView
        data={{ cards: mockCards, slider: true }}
        editable={false}
      />,
    );

    expect(getByText('Card 1 Title')).toBeInTheDocument();
    expect(getByText('Card 1 Description')).toBeInTheDocument();
  });
});
