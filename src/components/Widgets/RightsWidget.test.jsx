import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Widget from './RightsWidget';
import '@testing-library/jest-dom';

jest.mock('@plone/volto/components', () => ({
  FormFieldWrapper: ({ children }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

jest.mock('semantic-ui-react', () => {
  const Radio = ({ label, value, checked, onChange }) => (
    <label>
      <input
        type="radio"
        data-testid={`radio-${label}`}
        value={value}
        checked={checked || false}
        onChange={(e) => onChange(e, { value })}
      />
      {label}
    </label>
  );
  const TextArea = ({ value, onChange }) => (
    <textarea
      data-testid="textarea"
      value={value || ''}
      onChange={(e) => onChange(e, { value: e.target.value })}
    />
  );
  return { Radio, TextArea };
});

describe('Widget', () => {
  const onChangeMock = jest.fn();
  const defaultProps = {
    id: 'license',
    onChange: onChangeMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with EEA License selected by default', () => {
    render(<Widget {...defaultProps} />);

    const eeaRadio = screen.getByTestId(
      'radio-EEA Copyright Creative Commons CC-by licence',
    );
    const otherRadio = screen.getByTestId('radio-Other');

    expect(eeaRadio.checked).toBe(true);
    expect(otherRadio.checked).toBe(false);
    expect(screen.queryByTestId('textarea')).not.toBeInTheDocument();
  });

  it('switches to "Other" and shows textarea', () => {
    render(<Widget {...defaultProps} />);

    const otherRadio = screen.getByTestId('radio-Other');
    fireEvent.click(otherRadio);

    expect(onChangeMock).toHaveBeenCalledWith('license', null);
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
  });

  it('updates value when typing in textarea', () => {
    render(<Widget {...defaultProps} value="other" />);

    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'Custom license text' } });

    expect(onChangeMock).toHaveBeenCalledWith('license', 'Custom license text');
  });

  it('selecting EEA License calls onChange with EEA_LICENSE', () => {
    render(<Widget {...defaultProps} value="other" />);

    const eeaRadio = screen.getByTestId(
      'radio-EEA Copyright Creative Commons CC-by licence',
    );
    fireEvent.click(eeaRadio);

    expect(onChangeMock).toHaveBeenCalledWith(
      'license',
      expect.stringContaining('EEA standard re-use policy'),
    );
  });
});
