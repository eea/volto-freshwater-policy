import React from 'react';
import { Accordion as SemanticAccordion, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import AccordionContent from './AccordionContent';
import { useHistory } from 'react-router-dom';
import upArrow from '@plone/volto/icons/up-key.svg';
import downArrow from '@plone/volto/icons/down-key.svg';

const Accordion = (props) => {
  const { items = {}, curent_location, activeMenu, data = {} } = props;
  const [currentIndex, setIndex] = React.useState(activeMenu ?? 0);
  const history = useHistory();

  const handleClick = (e, item) => {
    let itemUrl = '/' + item['@id'].split('/').slice(3).join('/');
    history.push(itemUrl);
  };

  const handleIconClick = (e, index) => {
    e.stopPropagation();
    const newIndex = currentIndex === index ? -1 : index;
    setIndex(newIndex);
  };
  return (
    <>
      <div className="context-navigation-header">{data?.title}</div>
      {items.map((item, index) => {
        const { id } = item;
        const active = currentIndex === index;

        return (
          <SemanticAccordion id={id} key={index} className="secondary">
            <SemanticAccordion.Title
              role="button"
              tabIndex={0}
              active={activeMenu === index}
              aria-expanded={activeMenu === index}
              index={index}
              onClick={(e) => {
                handleClick(e, item);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  e.preventDefault();
                  handleClick(e, item);
                }
              }}
            >
              <span className="item-title">{item.title}</span>
              {active ? (
                <Button
                  icon
                  basic
                  onClick={(e) => {
                    handleIconClick(e, index);
                  }}
                >
                  <Icon name={upArrow} />
                </Button>
              ) : (
                <Button
                  icon
                  basic
                  onClick={(e) => {
                    handleIconClick(e, index);
                  }}
                >
                  <Icon name={downArrow} />
                </Button>
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
