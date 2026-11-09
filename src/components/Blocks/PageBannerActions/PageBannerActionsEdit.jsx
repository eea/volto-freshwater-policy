import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import PageBannerActionsSchema from './schema';
import PageBannerActionsView from './PageBannerActionsView';

const PageBannerActionsEdit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const schema = PageBannerActionsSchema();

  return (
    <>
      <PageBannerActionsView {...props} />

      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          block={block}
          onChangeBlock={onChangeBlock}
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

export default PageBannerActionsEdit;
