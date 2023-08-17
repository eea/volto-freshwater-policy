import React from 'react';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import InfoOverlay from './InfoOverlay';
import FeatureInteraction from './FeatureInteraction';
import CaseStudyList from './CaseStudyListing';

import { getFeatures } from './utils';
// import iconLight from './images/icon-light.png';
// import iconDepth from './images/icon-depth.png';

const styleCache = {};

export default function CaseStudyMap(props) {
  const {
    items,
    activeItems,
    hideFilters,
    selectedCase,
    onSelectedCase,
  } = props;
  console.log('render map');
  const features = getFeatures(items); //console.log('Features list', features);

  const [tileWMSSources] = React.useState([
    new ol.source.TileWMS({
      url: 'https://gisco-services.ec.europa.eu/maps/service',
      params: {
        // LAYERS: 'OSMBlossomComposite', OSMCartoComposite, OSMPositronComposite
        LAYERS: 'OSMPositronComposite',
        TILED: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  ]);
  const [pointsSource] = React.useState(
    new ol.source.Vector({
      features,
    }),
  );

  const [clusterSource] = React.useState(
    new ol.source.Cluster({
      distance: 19,
      source: pointsSource,
    }),
  );

  React.useEffect(() => {
    if (activeItems) {
      pointsSource.clear();
      pointsSource.addFeatures(getFeatures(activeItems));
    }
  }, [activeItems, pointsSource]);

  return features.length > 0 ? (
    <>
      <Map
        view={{
          center: ol.proj.fromLonLat([10, 50]),
          showFullExtent: true,
          zoom: 4,
        }}
        pixelRatio={1}
        // controls={ol.control.defaults({ attribution: false })}
      >
        <Controls attribution={false} />
        <Layers>
          <InfoOverlay
            selectedFeature={selectedCase}
            onFeatureSelect={onSelectedCase}
            layerId={tileWMSSources[0]}
            hideFilters={hideFilters}
          />
          <FeatureInteraction
            onFeatureSelect={onSelectedCase}
            hideFilters={hideFilters}
            selectedCase={selectedCase}
          />
          <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
          <Layer.Vector
            style={clusterStyle}
            source={clusterSource}
            zIndex={1}
          />
        </Layers>
      </Map>
      {hideFilters ? null : (
        <CaseStudyList
          activeItems={activeItems}
          selectedCase={selectedCase}
          onSelectedCase={onSelectedCase}
          pointsSource={pointsSource}
        />
      )}
    </>
  ) : null;
}

function clusterStyle(feature) {
  const size = feature.get('features').length;
  let style = styleCache[size];

  if (!style) {
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 12 + Math.min(Math.floor(size / 3), 10),
        stroke: new ol.style.Stroke({
          color: '#fff',
        }),
        fill: new ol.style.Fill({
          // 309ebc blue 3 + green 3 mix
          color: '#309ebc', // #006BB8 #309ebc
        }),
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: '#fff',
        }),
      }),
    });
    styleCache[size] = style;
  }

  if (size === 1) {
    // let color = feature.values_.features[0].values_['color'];
    let color = '#50B0A4'; // #0083E0 #50B0A4

    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: '#fff',
        }),
        stroke: new ol.style.Stroke({
          color: color,
          width: 6,
        }),
      }),
    });
  } else {
    return style;
  }
}
