import NWRMBenefitsTableBlockSchema from './schema';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import NWRMBenefitsTableView from './View';

const NWRMBenefitsTableEdit = (props) => {
  const { block, data, onChangeBlock, selected } = props;

  const schema = NWRMBenefitsTableBlockSchema();

  return (
    <>
      <NWRMBenefitsTableView {...props} />

      <SidebarPortal selected={selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default NWRMBenefitsTableEdit;
