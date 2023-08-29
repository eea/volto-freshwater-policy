import React, { useEffect, useState, useRef } from 'react';
import { Grid, Accordion } from 'semantic-ui-react';
import { BodyClass } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import { CaseStudyExplorer } from '@eeacms/volto-freshwater-policy/components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './style.less';

import downSVG from '@plone/volto/icons/down-key.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import leftSVG from '@plone/volto/icons/left-key.svg';

import Slider from 'react-slick';

const level2 = {
  Provisioning: ['ES1', 'ES2', 'ES3'],
  'Regulatory and maintenance': ['ES4', 'ES5', 'ES6', 'ES7', 'ES8', 'ES9'],
  Cultural: ['ES10', 'ES11'],
  Abiotic: ['ES12', 'ES13', 'ES14'],
  'Mechanism of Water Retention': [
    'BP1',
    'BP2',
    'BP3',
    'BP4',
    'BP5',
    'BP6',
    'BP7',
  ],
  'Biophysical Impacts Resulting from Water Retention': [
    'BP8',
    'BP9',
    'BP10',
    'BP11',
    'BP12',
    'BP13',
    'BP14',
    'BP15',
    'BP16',
    'BP17',
  ],
};

const level3 = {
  'Slowing and reducing runoff': ['BP1', 'BP2', 'BP3', 'BP4'],
  'Reducing runoff': ['BP5', 'BP6', 'BP7'],
  'Reducing pollution': ['BP8', 'BP9'],
  'Soil conservation': ['BP10', 'BP11'],
  'Creating habitat': ['BP12', 'BP13', 'BP14'],
  'Climate alteration': ['BP15', 'BP16', 'BP17'],
};

// Compare alphanumeric strings, used for sorting both lexicographically and numerically
const compareAlphanumericStrings = (firstInput, secondInput) => {
  const regex = /(\d+)|(\D+)/g;
  const firstInputArray = String(firstInput).match(regex);
  const secondInputArray = String(secondInput).match(regex);

  while (firstInputArray.length > 0 && secondInputArray.length > 0) {
    const partA = firstInputArray.shift();
    const partB = secondInputArray.shift();

    if (partA !== partB) {
      const isNumberA = /^\d+$/.test(partA);
      const isNumberB = /^\d+$/.test(partB);

      if (isNumberA && isNumberB) {
        return Number(partA) - Number(partB);
      } else if (isNumberA) {
        return -1;
      } else if (isNumberB) {
        return 1;
      } else {
        return partA.localeCompare(partB);
      }
    }
  }

  return firstInputArray.length - secondInputArray.length;
};

const sortByLevel = (data) => {
  data.sort((a, b) => {
    // Sort rows by levels
    const levelA = a.level;
    const levelB = b.level;
    const textA = a.code;
    const textB = b.code;

    if (levelA === levelB) {
      // If levels are the same, sort alphabetically by text
      return compareAlphanumericStrings(textA, textB);
    } else if (levelA === 'High') {
      return -1;
    } else if (levelB === 'High') {
      return 1;
    } else if (levelA === 'Medium') {
      return -1;
    } else if (levelB === 'Medium') {
      return 1;
    } else {
      return 0; // Default case: 'Low' or any other value
    }
  });
};

const ImageSource = (props) => {
  const { image } = props;

  return (
    image['@type'] === 'Image' && (
      <div className="header_source">
        {image.description.includes('http') ? (
          <div className="field--label-inline">
            <div className="field__label">
              <a
                target="_blank"
                rel="noreferrer"
                href={image.description.split(': ')[1]}
                style={{ display: 'flex', gap: '5px' }}
              >
                <span>Source </span>
                <i class="ri-external-link-line"></i>
              </a>
            </div>
          </div>
        ) : (
          <div className="field--label-inline source">
            <div className="field__label">Source:</div>
            <div className="field__item">
              {image.description.split(': ')[1]}
            </div>
          </div>
        )}
      </div>
    )
  );
};

const MeasureView = (props) => {
  const { content } = props;
  const [activeIndices, setActiveIndices] = useState([0]);
  const [activeImage, setActiveImage] = useState(0);
  const imageItems = content.items.filter((item) => item['@type'] === 'Image');

  sortByLevel(content.ecosystem_services);
  sortByLevel(content.biophysical_impacts);
  sortByLevel(content.policy_objectives);

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

  useEffect(() => {
    // Add a class with the coresponding level from the table
    const fieldItems = document.querySelectorAll('.field--name-field-level');
    fieldItems.forEach((fieldItem) => {
      const innerText = fieldItem.textContent;

      if (innerText === 'High') {
        fieldItem.classList.add('high');
      }
      if (innerText === 'Medium') {
        fieldItem.classList.add('medium');
      }
      if (innerText === 'Low') {
        fieldItem.classList.add('low');
      }
    });
  });

  const slider = useRef();

  const goToPrevSlide = () => {
    slider.current.slickPrev();
  };

  const goToNextSlide = () => {
    slider.current.slickNext();
  };

  return (
    <>
      <BodyClass className="measure-view" />

      <div id="page-document" className="ui container">
        <div>
          <div className="metadata-header">
            <div>
              <div className="images-container content-box">
                <div className="image-flexbox">
                  <div className="header_info">
                    <div>
                      <h1>{content.title}</h1>
                      <div className="field--label-inline">
                        <div className="field__label">Code:</div>
                        <div className="field__item">
                          {content.measure_code}
                        </div>
                      </div>

                      <div className="field--label-inline">
                        <div className="field__label">Sector:</div>
                        <div className="field__item">
                          {content.measure_sector}
                        </div>
                      </div>

                      {content.other_sector && (
                        <>
                          <div className="field--label-inline">
                            <div className="field__label">Other sector(s)</div>
                            <div className="field__item">
                              {content.other_sector}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <br />
                  </div>
                </div>
                <div className="carousel-wrapper">
                  {imageItems.length === 1 ? (
                    <>
                      <LazyLoadImage
                        className="one-image"
                        src={imageItems[0]['@id'] + '/@@images/image/preview'}
                        title={imageItems[0]['@id'].title}
                        alt={imageItems[0]['@id'].title}
                      />
                      <ImageSource image={imageItems[0]} />
                    </>
                  ) : (
                    <Slider
                      className="carousel"
                      arrows={false}
                      ref={slider}
                      initialSlide={activeImage}
                      beforeChange={(currentSlide, nextSlide) => {
                        setActiveImage(nextSlide);
                      }}
                    >
                      {imageItems.map((item, index) => (
                        <div key={`image-${index}`}>
                          <LazyLoadImage
                            className={`image-slide ${
                              activeImage === index ? 'current' : 'not-current'
                            } ${imageItems.length === 1 && 'one-image'}`}
                            src={item['@id'] + '/@@images/image/preview'}
                            title={item['@id'].title}
                            alt={item['@id'].title}
                          />
                          <ImageSource image={item} />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {imageItems.length > 1 && (
                    <div className="buttons-wrapper">
                      <Icon
                        onClick={goToPrevSlide}
                        className="prev-button"
                        size="30px"
                        name={leftSVG}
                      />
                      <Icon
                        onClick={goToNextSlide}
                        className="next-button"
                        size="30px"
                        name={rightSVG}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <br />

            <div>
              <h3>Summary</h3>
              <div
                className="field__item"
                dangerouslySetInnerHTML={{
                  __html: content.measure_summary.data,
                }}
              ></div>
            </div>

            <br />
            <div>
              <h3>Benefits</h3>
              <Accordion fluid styled>
                {/* Ecosystem service */}
                <Accordion.Title
                  active={activeIndices.includes(0)}
                  index={0}
                  onClick={() => handleAccordionClick(0)}
                >
                  <h4>Ecosystem service</h4>
                  <Icon
                    size="30px"
                    name={activeIndices.includes(0) ? upSVG : downSVG}
                  />
                </Accordion.Title>
                <Accordion.Content active={activeIndices.includes(0)}>
                  <div className="field__items">
                    <div className="field__item">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Benefits</th>
                              <th colSpan={1}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {content.ecosystem_services.map((item, index) => (
                              <tr
                                key={`row-es-${index}`}
                                id={`row-es-${index}`}
                              >
                                <td className="field--name-field-level">
                                  {item.level}
                                </td>
                                <td>
                                  {Object.values(level2).map(
                                    (level, index) =>
                                      level.includes(item.code) &&
                                      Object.keys(level2)[index],
                                  )}
                                </td>
                                <td>
                                  {item.code} {item.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Accordion.Content>

                {/* Biophysical */}
                <Accordion.Title
                  active={activeIndices.includes(1)}
                  index={1}
                  onClick={() => handleAccordionClick(1)}
                >
                  <h4>Biophysical impacts</h4>
                  <Icon
                    size="30px"
                    name={activeIndices.includes(1) ? upSVG : downSVG}
                  />
                </Accordion.Title>
                <Accordion.Content active={activeIndices.includes(1)}>
                  <div className="field__items">
                    <div className="field__item">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Benefits</th>
                              <th colSpan={2}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {content.biophysical_impacts.map((item, index) => (
                              <tr
                                key={`row-bp-${index}`}
                                id={`row-bp-${index}`}
                              >
                                <td className="field--name-field-level">
                                  {item.level}
                                </td>
                                <td>
                                  {Object.values(level2).map(
                                    (level, index) =>
                                      level.includes(item.code) &&
                                      Object.keys(level2)[index],
                                  )}
                                </td>
                                <td>
                                  {Object.values(level3).map(
                                    (level, index) =>
                                      level.includes(item.code) &&
                                      Object.keys(level3)[index],
                                  )}
                                </td>
                                <td>
                                  {item.code} {item.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Accordion.Content>

                {/* Policy Objectives */}
                <Accordion.Title
                  active={activeIndices.includes(2)}
                  index={2}
                  onClick={() => handleAccordionClick(2)}
                >
                  <h4>Policy Objectives</h4>
                  <Icon
                    size="30px"
                    name={activeIndices.includes(2) ? upSVG : downSVG}
                  />
                </Accordion.Title>
                <Accordion.Content active={activeIndices.includes(2)}>
                  <div className="field__items">
                    <div className="field__item">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Benefits</th>
                            </tr>
                          </thead>
                          <tbody>
                            {content.policy_objectives.map((item, index) => (
                              <tr
                                key={`row-po-${index}`}
                                id={`row-po-${index}`}
                              >
                                <td className="field--name-field-level">
                                  {item.level}
                                </td>
                                <td>
                                  {item.code} {item.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion>
            </div>

            <br />
            <h3>Related case studies</h3>
            <div className="full-width case-study-wrapper">
              <div className="ui container">
                <div>
                  <Grid.Row>
                    <Grid columns="12">
                      <Grid.Column
                        mobile={8}
                        tablet={8}
                        computer={8}
                        className="col-left"
                      >
                        <CaseStudyExplorer
                          caseStudiesIds={
                            content.case_studies
                              ? content.case_studies.map((item) => {
                                  return item['@id'].split('/').pop();
                                })
                              : null
                          }
                        />
                      </Grid.Column>
                      <Grid.Column
                        mobile={4}
                        tablet={4}
                        computer={4}
                        className="col-right"
                      >
                        {content.case_studies && (
                          <div>
                            <div className="case-studies-list">
                              <ul>
                                {content.case_studies.map((item) => (
                                  <li key={item['@id']}>
                                    <a href={item['@id']}>{item.title}</a>
                                  </li>
                                ))}{' '}
                              </ul>
                            </div>
                          </div>
                        )}
                      </Grid.Column>
                    </Grid>
                  </Grid.Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeasureView;
