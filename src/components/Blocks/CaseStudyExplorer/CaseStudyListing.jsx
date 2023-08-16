import { getFeatures } from './utils';

export default function CaseStudyList(props) {
  const { activeItems, selectedCase, onSelectedCase } = props;

  return activeItems.length === 0 ? (
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
        activeItems.map((item) => {
          return (
            <div className="u-item listing-item result-item">
              <div className="slot-top">
                <div className="listing-body">
                  <button
                    class="ui button primary"
                    onClick={() => {
                      const features = getFeatures([item]);
                      onSelectedCase(features[0].values_);
                    }}
                  >
                    Show on map
                  </button>
                  <h3 className="listing-header">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={item.properties.path}
                      title={item.properties.title}
                    >
                      {item.properties.title}
                    </a>
                  </h3>
                  <p className="listing-description">
                    {item.properties.description}
                  </p>
                  <div className="slot-bottom">
                    <div className="result-bottom">
                      <div className="result-info">3 Aug 2023</div>
                      <div className="result-info">
                        <span className="result-info-title">Sectors:</span>
                        <span>{item.properties.sectors.join(', ')}</span>
                      </div>
                      <div className="result-info">
                        <span className="result-info-title">
                          NWRMs implemented:
                        </span>
                        <span>
                          {item.properties.measures
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
