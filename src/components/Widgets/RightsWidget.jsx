import React from 'react';
import { FormFieldWrapper } from '@plone/volto/components';
import { Radio, TextArea } from 'semantic-ui-react';

const EEA_LICENSE =
  'EEA standard re-use policy: unless otherwise indicated, ' +
  're-use of content on the EEA website for commercial or ' +
  'non-commercial purposes is permitted free of charge, ' +
  'provided that the source is acknowledged ' +
  '(https://www.eea.europa.eu/legal/copyright)';

export default (props) => {
  const { value = EEA_LICENSE, onChange, id } = props;
  const [otherValue, setOtherValue] = React.useState();

  React.useEffect(() => {
    const isEEA = value === EEA_LICENSE;
    isEEA ? setOtherValue(false) : setOtherValue(true);
  }, [value]);

  return (
    <FormFieldWrapper {...props}>
      <Radio
        label="EEA Copyright Creative Commons CC-by licence"
        value={EEA_LICENSE}
        checked={value === EEA_LICENSE}
        onChange={(e, data) => {
          onChange(id, data.value);
        }}
      />
      <Radio
        label="Other"
        value="other"
        checked={otherValue}
        onChange={(evt, data) => {
          setOtherValue(true);
          onChange(id, null);
        }}
      />
      {otherValue && (
        <TextArea
          value={value}
          onChange={(e, data) => {
            onChange(id, data.value);
          }}
        />
      )}
    </FormFieldWrapper>
  );
};
