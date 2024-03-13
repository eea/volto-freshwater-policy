import React from 'react';
import { Accordion as SemanticAccordion, Icon } from 'semantic-ui-react';
import AccordionContent from './AccordionContent';
import { useHistory } from 'react-router-dom';

const Accordion = (props) => {
  const { items = {}, curent_location, activeMenu } = props;

  const history = useHistory();

  const handleClick = (e, item) => {
    let itemUrl = '/' + item['@id'].split('/').slice(3).join('/');
    history.push(itemUrl);
  };
  return (
    <>
      {items.map((item, index) => {
        const { id } = item;
        const active = activeMenu === index;

        return (
          <SemanticAccordion id={id} key={index} className="secondary">
            <SemanticAccordion.Title
              role="button"
              tabIndex={0}
              active={active}
              aria-expanded={active}
              index={index}
              onClick={(e) => handleClick(e, item)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  e.preventDefault();
                  handleClick(e, item);
                }
              }}
            >
              <span className="item-title">{item.title}</span>
              {active ? (
                <Icon className="ri-arrow-up-s-line" />
              ) : (
                <Icon className="ri-arrow-down-s-line" />
              )}
            </SemanticAccordion.Title>
            <SemanticAccordion.Content active={active}>
              <AccordionContent
                curent_location={curent_location}
                key={index}
                main={{
                  title: item.title,
                  href: item['@id'],
                  url: item.url,
                }}
              />
            </SemanticAccordion.Content>
          </SemanticAccordion>
        );
      })}
    </>
  );
};

export default Accordion;
