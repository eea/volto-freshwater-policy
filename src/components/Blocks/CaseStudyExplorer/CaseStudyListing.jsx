import React from 'react';
import { zoomMapToFeatures } from './utils';

export default function CaseStudyList(props) {
  const { selectedCase, onSelectedCase, pointsSource, map } = props;

  // console.log('activeItems', activeItems);
  // React.useEffect(() => {
  //   if (activeItems) {
  //     pointsSource.clear();
  //     pointsSource.addFeatures(getFeatures(activeItems));
  //   }
  // }, [activeItems, pointsSource]);

  const features = pointsSource.getFeatures(selectedCase);

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
                  <div className="result-info">3 Aug 2023</div>
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
                  <div className="result-info">
                    <span className="result-info-title">
                      Available formats:
                    </span>
                    <span> GeoTIFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        features.map((item) => {
          return (
            <div className="u-item listing-item result-item">
              <div className="slot-top">
                <div className="listing-body">
                  <button
                    class="ui button primary"
                    onClick={() => {
                      // const features = getFeatures([item]);
                      onSelectedCase(item.values_);
                      zoomMapToFeatures(map, [item], 500000);
                    }}
                  >
                    Show on map
                  </button>
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
                  <p className="listing-description">
                    {item.values_.description}
                  </p>
                  <div className="slot-bottom">
                    <div className="result-bottom">
                      <div className="result-info">3 Aug 2023</div>
                      <div className="result-info">
                        <span className="result-info-title">Sectors:</span>
                        <span>{item.values_.sectors.join(', ')}</span>
                      </div>
                      <div className="result-info">
                        <span className="result-info-title">
                          NWRMs implemented:
                        </span>
                        <span>
                          {item.values_.nwrms_implemented
                            .map((item) => {
                              return item.title;
                            })
                            .join(', ')}
                        </span>
                      </div>
                      <div className="result-info">
                        <span className="result-info-title">
                          Available formats:
                        </span>
                        <span> GeoTIFF</span>
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
