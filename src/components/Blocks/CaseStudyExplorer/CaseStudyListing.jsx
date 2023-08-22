import React from 'react';
import { zoomMapToFeatures } from './utils';

export default function CaseStudyList(props) {
  const {
    selectedCase,
    onSelectedCase,
    pointsSource,
    map,
    searchInput,
  } = props;
  const reSearch = new RegExp(`\\b(${searchInput})\\b`, 'gi');

  const features = pointsSource
    .getFeatures(selectedCase)
    .sort((item1, item2) =>
      item1.values_.title.localeCompare(item2.values_.title),
    );

  return features.length === 0 ? (
    <>
      <h3 style={{ margin: 'calc(2rem - 0.1em) 0 1rem' }}>
        We could not find any results for your search criteria
      </h3>
      <ul>
        <li>check the selected filters</li>
      </ul>
    </>
  ) : (
    <div className="listing">
      {selectedCase ? (
        <div className="u-item listing-item result-item">
          <div className="slot-top">
            <div className="listing-body">
              <h3 className="listing-header">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={selectedCase.path}
                  title={selectedCase.title}
                >
                  {selectedCase.title}
                </a>
              </h3>
              <p className="listing-description">{selectedCase.description}</p>
              <div className="slot-bottom">
                <div className="result-bottom">
                  <div className="result-info">
                    <span className="result-info-title">Sectors:</span>
                    <span>
                      {selectedCase.sectors
                        ? selectedCase.sectors.join(', ')
                        : ''}
                    </span>
                  </div>
                  <div className="result-info">
                    <span className="result-info-title">
                      NWRMs implemented:
                    </span>
                    <span>
                      {selectedCase.nwrms_implemented
                        ? selectedCase.nwrms_implemented
                            .map((item) => {
                              return item.title;
                            })
                            .join(', ')
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        features.map((item, index) => {
          return (
            <div className="u-item listing-item result-item" key={index}>
              <div className="slot-top">
                <div className="listing-body">
                  <h3 className="listing-header">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={item.values_.path}
                      title={item.values_.title}
                    >
                      {item.values_.title}
                    </a>
                  </h3>
                  <p
                    className="listing-description"
                    dangerouslySetInnerHTML={{
                      __html: searchInput
                        ? item.values_.description.replaceAll(
                            reSearch,
                            '<b>$1</b>',
                          )
                        : item.values_.description,
                    }}
                  ></p>
                  <div className="slot-bottom">
                    <div className="result-bottom">
                      <div className="result-info">
                        <span className="result-info-title">Sectors:</span>
                        <span>{item.values_.sectors.join(', ')}</span>
                      </div>
                      <div className="result-info">
                        <span className="result-info-title">
                          NWRMs implemented:
                        </span>

                        {item.values_.nwrms_implemented.map(
                          (measure, index) => {
                            return (
                              <span>
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={measure.path}
                                >
                                  {measure.title}
                                  {index !==
                                  item.values_.nwrms_implemented.length - 1
                                    ? ', '
                                    : ''}
                                </a>
                              </span>
                            );
                          },
                        )}
                      </div>
                      <div
                        className="result-info show-on-map"
                        tabIndex="0"
                        role="button"
                        onKeyDown={() => {}}
                        onClick={() => {
                          // scroll to the map
                          const element = document.getElementById('cse-filter');
                          element.scrollIntoView({
                            behavior: 'smooth',
                          });

                          // const features = getFeatures([item]);
                          onSelectedCase(item.values_);
                          zoomMapToFeatures(map, [item], 100000);
                        }}
                      >
                        <span className="result-info-title">Show on map</span>
                        <i className="icon ri-road-map-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
