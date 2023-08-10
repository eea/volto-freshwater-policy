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
  const [nationalId, setNationalId] = React.useState('');
  const [siteName, setSiteName] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [NUTSCode, setNUTSCode] = React.useState('');
  const [RBDcode, setRBDcode] = React.useState('');
  const [transboundary, setTransboundary] = React.useState('');

  const handleAccordionClick = (index) => {
    // Check if the index is already in the activeIndices array
    const isActive = activeIndices.includes(index);
    if (isActive) {
      // If the index is active, remove it from the array
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      // If the index is not active, add it to the array
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
      ).textContent,
    );
    setNationalId(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-national-id .field__item',
      ).textContent,
    );
    setSiteName(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-site-name .field__item',
      ).textContent,
    );
    setLongitude(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-longitude .field__item',
      ).textContent,
    );
    setLatitude(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-latitude  .field__item',
      ).textContent,
    );
    setNUTSCode(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-nuts-code .field__item',
      ).textContent,
    );
    setRBDcode(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-rbd-code .field__item',
      ).textContent,
    );
    setTransboundary(
      generalDataElement.querySelector(
        '.field--name-field-nwrm-cs-transboundary .field__item',
      ).textContent,
    );
  }, [content]);

  return (
    <>
      <BodyClass className="case-study-view" />

      <div id="page-document" className="ui container">
        <div>
          <div className="metadata-header">
            {/* {content['@type'] && (
              <h3 className="item-type">{formatItemType(content['@type'])}</h3>
            )} */}
            <div className="page-header content-box">
              <div className="header-title-info">
                <h1>{content.title}</h1>
                <div className="header-info">
                  <div className="first-column">
                    <div className="field field--label-inline">
                      <div className="field__label">National Id:</div>
                      <div className="field__item">{nationalId}</div>
                    </div>

                    <div className="field field--label-inline">
                      <div className="field__label">Site name:</div>
                      <div className="field__item">{siteName}</div>
                    </div>
                  </div>

                  <div className="second-column">
                    <div className="field field--label-inline">
                      <div className="field__label">Longitude:</div>
                      <div className="field__item">{longitude}</div>
                    </div>

                    <div className="field field--label-inline">
                      <div className="field__label">Latitude:</div>
                      <div className="field__item">{latitude}</div>
                    </div>

                    <div className="field field--label-inline">
                      <div className="field__label">NUTS Code:</div>
                      <div className="field__item">{NUTSCode}</div>
                    </div>

                    <div className="field field--label-inline">
                      <div className="field__label">RBD code:</div>
                      <div className="field__item">{RBDcode}</div>
                    </div>

                    <div className="field field--label-inline">
                      <div className="field__label">Transboundary:</div>
                      <div className="field__item">{transboundary}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="body">
              <div className="field field--label-above field-with-margin">
                <h3 className="field__label">Summary</h3>
                <div className="field__item">{summary}</div>
              </div>

              <div className="field__item">
                {content.items.map(
                  (item) =>
                    item['@type'] === 'File' && (
                      <div className="field--label-inline field-with-margin">
                        <div className="field__label">
                          <a
                            href={item['@id'] + '/@@images/file'}
                            rel="noreferrer"
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

              <Accordion fluid styled>
                {content.sources && (
                  <div className="field--label-above field-with-margin">
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
                  </div>
                )}
              </Accordion>

              {Sections.map((item, index) => {
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
                            activeIndices.includes(index + 1) ? upSVG : downSVG
                          }
                        />
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndices.includes(index + 1)}
                      >
                        <div className="field__item">
                          <Section {...props} id={item.id} title={item.title} />
                        </div>
                      </Accordion.Content>
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudyView;
