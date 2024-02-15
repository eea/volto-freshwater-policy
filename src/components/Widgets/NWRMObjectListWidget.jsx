import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Accordion, Button, Segment } from 'semantic-ui-react';
import { DragDropList, FormFieldWrapper, Icon } from '@plone/volto/components';
import { applySchemaDefaults, reorderArray } from '@plone/volto/helpers';
import ObjectWidget from '@plone/volto/components/manage/Widgets/ObjectWidget';

import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import addSVG from '@plone/volto/icons/add.svg';
import dragSVG from '@plone/volto/icons/drag.svg';
import { v4 as uuid } from 'uuid';

// import ObjectListWidget from '@plone/volto/components/manage/Widgets/ObjectListWidget';

const messages = defineMessages({
  labelRemoveItem: {
    id: 'Remove item',
    defaultMessage: 'Remove item',
  },
  labelCollapseItem: {
    id: 'Collapse item',
    defaultMessage: 'Collapse item',
  },
  labelShowItem: {
    id: 'Show item',
    defaultMessage: 'Show item',
  },
  emptyObjectList: {
    id: 'Empty object list',
    defaultMessage: 'Empty object list',
  },
  add: {
    id: 'Add (object list)',
    defaultMessage: 'Add',
  },
});

const NWRMObjectListWidget = (props) => {
  const { block, fieldSet, id, schema, onChange, schemaExtender } = props;
  const value = props.value['value'] || props.value;
  const [localActiveObject, setLocalActiveObject] = React.useState(
    props.activeObject ?? value.length - 1,
  );

  let activeObject, setActiveObject;
  if (
    (props.activeObject || props.activeObject === 0) &&
    props.setActiveObject
  ) {
    activeObject = props.activeObject;
    setActiveObject = props.setActiveObject;
  } else {
    activeObject = localActiveObject;
    setActiveObject = setLocalActiveObject;
  }

  const intl = useIntl();

  function handleChangeActiveObject(e, blockProps) {
    const { index } = blockProps;
    const newIndex = activeObject === index ? -1 : index;

    setActiveObject(newIndex);
  }
  const objectSchema = typeof schema === 'function' ? schema(props) : schema;

  const topLayerShadow = '0 1px 1px rgba(0,0,0,0.15)';
  const secondLayer = ', 0 10px 0 -5px #eee, 0 10px 1px -4px rgba(0,0,0,0.15)';
  const thirdLayer = ', 0 20px 0 -10px #eee, 0 20px 1px -9px rgba(0,0,0,0.15)';

  return (
    <div className="objectlist-widget">
      <FormFieldWrapper {...props} noForInFieldLabel className="objectlist">
        <div className="add-item-button-wrapper">
          <Button
            compact
            icon
            aria-label={
              objectSchema.addMessage ||
              `${intl.formatMessage(messages.add)} ${objectSchema.title}`
            }
            onClick={(e) => {
              e.preventDefault();
              const data = {
                '@id': uuid(),
              };
              const objSchema = schemaExtender
                ? schemaExtender(schema, data, intl)
                : objectSchema;
              const dataWithDefaults = applySchemaDefaults({
                data,
                schema: objSchema,
                intl,
              });

              onChange(id, { value: [...value, dataWithDefaults] });
              setActiveObject(value.length);
            }}
          >
            <Icon name={addSVG} size="18px" />
            &nbsp;
            {/* Custom addMessage in schema, else default to English */}
            {objectSchema.addMessage ||
              `${intl.formatMessage(messages.add)} ${objectSchema.title}`}
          </Button>
        </div>
        {value.length === 0 && (
          <input
            aria-labelledby={`fieldset-${
              fieldSet || 'default'
            }-field-label-${id}`}
            type="hidden"
            value={intl.formatMessage(messages.emptyObjectList)}
          />
        )}
      </FormFieldWrapper>
      <DragDropList
        style={{
          boxShadow: `${topLayerShadow}${value.length > 1 ? secondLayer : ''}${
            value.length > 2 ? thirdLayer : ''
          }`,
        }}
        forwardedAriaLabelledBy={`fieldset-${
          fieldSet || 'default'
        }-field-label-${id}`}
        childList={value.map((o) => [o['@id'] || uuid(), o])}
        onMoveItem={(result) => {
          const { source, destination } = result;
          if (!destination) {
            return;
          }
          const newValue = reorderArray(value, source.index, destination.index);
          onChange(id, { value: newValue });
          return true;
        }}
      >
        {({ child, childId, index, draginfo }) => {
          return (
            <div
              ref={draginfo.innerRef}
              {...draginfo.draggableProps}
              key={childId}
            >
              <Accordion key={index} fluid styled>
                <Accordion.Title
                  active={activeObject === index}
                  index={index}
                  onClick={handleChangeActiveObject}
                  aria-label={`${
                    activeObject === index
                      ? intl.formatMessage(messages.labelCollapseItem)
                      : intl.formatMessage(messages.labelShowItem)
                  } #${index + 1}`}
                >
                  <button
                    style={{
                      visibility: 'visible',
                      display: 'inline-block',
                    }}
                    {...draginfo.dragHandleProps}
                    className="drag handle"
                  >
                    <Icon name={dragSVG} size="18px" />
                  </button>

                  <div className="accordion-title-wrapper">
                    {`${objectSchema.title} #${index + 1}`}
                  </div>
                  <div className="accordion-tools">
                    <button
                      aria-label={`${intl.formatMessage(
                        messages.labelRemoveItem,
                      )} #${index + 1}`}
                      onClick={() => {
                        onChange(id, {
                          value: value.filter((v, i) => i !== index),
                        });
                      }}
                    >
                      <Icon name={deleteSVG} size="20px" color="#e40166" />
                    </button>
                    {activeObject === index ? (
                      <Icon name={upSVG} size="20px" />
                    ) : (
                      <Icon name={downSVG} size="20px" />
                    )}
                  </div>
                </Accordion.Title>
                <Accordion.Content active={activeObject === index}>
                  <Segment>
                    <ObjectWidget
                      id={`${id}-${index}`}
                      key={`ow-${id}-${index}`}
                      block={block}
                      schema={
                        schemaExtender
                          ? schemaExtender(schema, child, intl)
                          : objectSchema
                      }
                      value={child}
                      onChange={(fi, fv) => {
                        const newvalue = value.map((v, i) =>
                          i !== index ? v : fv,
                        );
                        onChange(id, { value: newvalue });
                      }}
                    />
                  </Segment>
                </Accordion.Content>
              </Accordion>
            </div>
          );
        }}
      </DragDropList>
    </div>
  );
};

const ecosystemSchema = {
  title: 'Ecosystem service',
  fieldsets: [
    {
      id: 'default',
      title: 'default',
      fields: ['level', 'name'],
    },
  ],
  properties: {
    level: {
      title: 'Level',
      choices: [
        ['Low', 'Low'],
        ['Medium', 'Medium'],
        ['High', 'High'],
      ],
      // widget: 'textarea',
    },
    // code: {
    //   title: 'Code',
    //   // widget: 'textarea',
    // },
    name: {
      title: 'Name',
      // widget: 'textarea',
      choices: [
        ['ES1 - Water storage', 'ES1 - Water storage'],
        [
          'ES2 - Fish stocks and recruiting',
          'ES2 - Fish stocks and recruiting',
        ],
        [
          'ES3 - Natural biomass production',
          'ES3 - Natural biomass production',
        ],
        ['ES4 - Biodiversity preservation', 'ES4 - Biodiversity preservation'],
        [
          'ES5 - Climate change adaptation and mitigation',
          'ES5 - Climate change adaptation and mitigation',
        ],
        [
          'ES6 - Groundwater/aquifer recharge',
          'ES6 - Groundwater/aquifer recharge',
        ],
        ['ES7 - Flood risk reduction', 'ES7 - Flood risk reduction'],
        ['ES8 - Erosion/sediment control', 'ES8 - Erosion/sediment control'],
        ['ES9 - Filtration of pollutants', 'ES9 - Filtration of pollutants'],
        [
          'ES10 - Recreational opportunities',
          'ES10 - Recreational opportunities',
        ],
        ['ES11 - Aesthetic/cultural value', 'ES11 - Aesthetic/cultural value'],
        ['ES12 - Navigation', 'ES12 - Navigation'],
        ['ES13 - Geological resources', 'ES13 - Geological resources'],
        ['ES14 - Energy production', 'ES14 - Energy production'],
      ],
    },
  },
  required: [],
};

export const EcosystemServiceWidget = (props) => (
  <NWRMObjectListWidget {...props} schema={ecosystemSchema} />
);

export default NWRMObjectListWidget;

// ['ES1 - Water storage', 'ES1 - Water storage'],
// ['ES2 - Fish stocks and recruiting', 'ES2 - Fish stocks and recruiting'],
// ['ES3 - Natural biomass production', 'ES3 - Natural biomass production'],
// ['ES4 - Biodiversity preservation', 'ES4 - Biodiversity preservation'],
// ['ES5 - Climate change adaptation and mitigation', 'ES5 - Climate change adaptation and mitigation'],
// ['ES6 - Groundwater/aquifer recharge', 'ES6 - Groundwater/aquifer recharge'],
// ['ES7 - Flood risk reduction', 'ES7 - Flood risk reduction'],
// ['ES8 - Erosion/sediment control', 'ES8 - Erosion/sediment control'],
// ['ES9 - Filtration of pollutants', 'ES9 - Filtration of pollutants'],
// ['ES10 - Recreational opportunities', 'ES10 - Recreational opportunities'],
// ['ES11 - Aesthetic/cultural value', 'ES11 - Aesthetic/cultural value'],
// ['ES12 - Navigation', 'ES12 - Navigation'],
// ['ES13 - Geological resources', 'ES13 - Geological resources'],
// ['ES14 - Energy production', 'ES14 - Energy production'],
