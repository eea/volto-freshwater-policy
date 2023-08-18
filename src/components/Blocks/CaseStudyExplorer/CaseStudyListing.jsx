import React from 'react';
import { useStyles } from './FeatureInteraction';
import { zoomMapToFeatures } from './utils';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

export default function CaseStudyList(props) {
  const {
    selectedCase,
    onSelectedCase,
    pointsSource,
    map,
    searchInput,
  } = props;
  const { selectStyle } = useStyles();

  // const selectInteraction = new ol.interaction.Select({
  //   condition: ol.condition.click,
  //   style: selectStyle,
  // });

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
        features.map((item, index) => {
          return (
            <div className="u-item listing-item result-item" key={index}>
              <div className="slot-top">
                <div className="listing-body">
                  <button
                    className="ui button primary"
                    onClick={() => {
                      // scroll to the map
                      const element = document.getElementById('cse-filter');
                      element.scrollIntoView({
                        behavior: 'smooth',
                      });

                      // const features = getFeatures([item]);
                      onSelectedCase(item.values_);
                      zoomMapToFeatures(map, [item], 500000);

                      // let evt = {};
                      // evt.type = 'select';
                      // evt.coordinate = [];
                      // evt.coordinate[0] =
                      //   item.values_.geometry.flatCoordinates[0];
                      // evt.coordinate[1] =
                      //   item.values_.geometry.flatCoordinates[1];
                      // map.dispatchEvent(evt);

                      //   var fakeOnSelectEvent = new ol.interaction.Select.Event(
                      //     ol.interaction.Select.EventType.SELECT,
                      //     [item],
                      //     [],
                      //     false,
                      //   );

                      //   ol.events.EventTarget.prototype.dispatchEvent.call(
                      //     selectInteraction,
                      //     fakeOnSelectEvent,
                      //   );
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
                  <p
                    className="listing-description"
                    dangerouslySetInnerHTML={{
                      __html: searchInput
                        ? item.values_.description.replace(
                            searchInput,
                            '<b>' + searchInput + '</b>',
                          )
                        : item.values_.description,
                    }}
                  ></p>
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
