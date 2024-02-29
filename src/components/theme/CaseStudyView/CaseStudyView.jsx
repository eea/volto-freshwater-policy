import React from 'react';
import { BodyClass } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import { Accordion } from 'semantic-ui-react';

import downSVG from '@plone/volto/icons/down-key.svg';
import upSVG from '@plone/volto/icons/up-key.svg';

import './style.less';

const Sections = [
  // {
  //   id: 'general',
  //   title: 'General',
  // },
  {
    id: 'site_information',
    title: 'Site information',
  },
  {
    id: 'monitoring_maintenance',
    title: 'Monitoring maintenance',
  },
  {
    id: 'performance',
    title: 'Performance',
  },
  {
    id: 'design_and_implementations',
    title: 'Design and implementations',
  },
  {
    id: 'lessons_risks_implications',
    title: 'Lessons, risks, implications...',
  },
  {
    id: 'policy_general_governance',
    title: 'Policy, general governance and design targets',
  },
  {
    id: 'socio_economic',
    title: 'Socio-economic',
  },
  {
    id: 'biophysical_impacts',
    title: 'Biophysical impacts',
  },
];

const Section = (props) => {
  const { content, id } = props;
  const data = content[id]?.data || null;

  if (data === null) {
    return <></>;
  }

  return (
    <>
      <div
        className={id}
        dangerouslySetInnerHTML={{ __html: content[id]?.data }}
      ></div>
    </>
  );
};

const CaseStudyView = (props) => {
  const { content } = props;
  const [activeIndices, setActiveIndices] = React.useState([]);
  const [summary, setSummary] = React.useState('');
  const [firstColumnData, setFirstColumnData] = React.useState({});
  const [secondColumnData, setSecondColumnData] = React.useState({});

  const handleAccordionClick = (index) => {
    const isActive = activeIndices.includes(index);
    if (isActive) {
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      setActiveIndices([...activeIndices, index]);
    }
  };

  React.useEffect(() => {
    // Convert the HTML string to a DOM element using DOMParser
    const parser = new DOMParser();
    const generalDataElement = parser.parseFromString(
      content['general']?.data || '',
      'text/html',
    );
    setSummary(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-summary .field__item',
      )?.textContent,
    );
    setFirstColumnData({
      'National Id':
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-national-id .field__item',
        )?.textContent || '',
      'Site Name':
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-site-name .field__item',
        )?.textContent || '',
    });
    setSecondColumnData({
      Longitude:
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-longitude .field__item',
        )?.textContent || '',
      Latitude:
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-latitude  .field__item',
        )?.textContent || '',
      'NUTS Code':
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-nuts-code .field__item',
        )?.textContent || '',
      'RBD code':
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-rbd-code .field__item',
        )?.textContent || '',
      Transboundary:
        generalDataElement.querySelector(
          '.field--name-field-nwrm-cs-transboundary .field__item',
        )?.textContent || '',
    });
  }, [content]);

  React.useEffect(() => {
    const parentElements = document.querySelectorAll(
      '.accordion .field--label-above',
    );

    parentElements.forEach((parentElement) => {
      const tableElement = parentElement.querySelector('.table-responsive');
      if (!tableElement) {
        parentElement.classList.add('no-table');
      }
    });

    // transform table to list
    const tableContainer = document.querySelector(
      '.field--name-field-nwrm-cs-policy-tgt .table-responsive',
    );
    const table = document.getElementById('paragraph-nwrm_cs_policy_tgt');
    const newList = document.createElement('ul');

    table.querySelectorAll('tbody tr').forEach((row) => {
      // Create a list item for each row
      const listItem = document.createElement('li');

      // Iterate through the cells of the row
      row.querySelectorAll('td').forEach((cell) => {
        listItem.textContent += cell.textContent + ', ';
      });
      listItem.textContent = listItem.textContent.slice(0, -2);
      newList.appendChild(listItem);
    });

    const firstRow = table.rows[0];
    firstRow.cells.length === 1 && tableContainer.replaceChild(newList, table);
  }, []);

  return (
    <>
      <BodyClass className="case-study-view" />

      <div id="page-document" className="ui container">
        <div>
          <div className="metadata-header">
            <div className="page-header content-box">
              <div className="header-title-info">
                <h1>{content.title}</h1>
                <div className="header-info">
                  <div className="first-column">
                    {Object.entries(firstColumnData).map(
                      ([label, item]) =>
                        item && (
                          <div
                            className="field field--label-inline"
                            key={label}
                          >
                            <div className="field__label">{label}:</div>
                            <div className="field__item">{item}</div>
                          </div>
                        ),
                    )}
                  </div>

                  <div className="second-column">
                    {Object.entries(secondColumnData).map(
                      ([label, item]) =>
                        item && (
                          <div
                            className="field field--label-inline"
                            key={label}
                          >
                            <div className="field__label">{label}:</div>
                            <div className="field__item">{item}</div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="body">
              {summary && (
                <div className="field field--label-above field-with-margin">
                  <h3 className="field__label">Summary</h3>
                  <div className="field__item">{summary}</div>
                </div>
              )}

              <div className="field__item">
                {content.items.map(
                  (item) =>
                    item['@type'] === 'File' && (
                      <div className="field--label-inline field-with-margin">
                        <div className="field__label">
                          <a
                            href={item['@id'] + '/@@images/file'}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            The in-depth description of the case study (link)
                          </a>
                        </div>
                      </div>
                    ),
                )}
              </div>

              {content.measures && (
                <div className="field--label-above field-with-margin">
                  <h3 className="field__label">
                    NWRM(s) implemented in the case study
                  </h3>
                  <div className="field__item">
                    <ul>
                      {content.measures.map((item) => (
                        <li key={item['@id']}>
                          <a href={item['@id']}>{item.title}</a>
                        </li>
                      ))}{' '}
                    </ul>
                  </div>
                </div>
              )}

              <div className="accordion-wrapper">
                <div className="field--label-above">
                  <Accordion fluid styled>
                    {content.sources && (
                      <>
                        <Accordion.Title
                          active={activeIndices.includes(0)}
                          index={0}
                          onClick={() => handleAccordionClick(0)}
                        >
                          <h4 className="field__label">Sources</h4>
                          <Icon
                            size="30px"
                            name={activeIndices.includes(0) ? upSVG : downSVG}
                          />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndices.includes(0)}>
                          <div className="field__item">
                            <ul>
                              {content.sources.map((item) => (
                                <li key={item['@id']}>
                                  <a href={item['@id']}>{item.title}</a>
                                </li>
                              ))}{' '}
                            </ul>
                          </div>
                        </Accordion.Content>
                      </>
                    )}
                  </Accordion>
                </div>

                {Sections.map((item, index) => {
                  const sectionData = content[item.id]?.data;

                  if (sectionData) {
                    return (
                      <div className="field--label-above">
                        <Accordion>
                          <Accordion.Title
                            active={activeIndices.includes(index + 1)}
                            index={index + 1}
                            onClick={() => handleAccordionClick(index + 1)}
                          >
                            <h4 className="field__label">{item.title}</h4>
                            <Icon
                              size="30px"
                              name={
                                activeIndices.includes(index + 1)
                                  ? upSVG
                                  : downSVG
                              }
                            />
                          </Accordion.Title>
                          <Accordion.Content
                            active={activeIndices.includes(index + 1)}
                          >
                            <div className="field__item">
                              <Section
                                {...props}
                                id={item.id}
                                title={item.title}
                              />
                            </div>
                          </Accordion.Content>
                        </Accordion>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudyView;
