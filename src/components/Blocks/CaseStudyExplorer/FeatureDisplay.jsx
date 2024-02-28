import React from 'react';

export default function FeatureDisplay({ feature }) {
  return feature ? (
    <div id="csepopup">
      <h3>
        <strong>
          <a target="_blank" rel="noopener" href={feature.path}>
            {feature.title}
          </a>
        </strong>
      </h3>
      <div>
        <h4>NWRMs implemented</h4>
        <ul>
          {feature.nwrms_implemented.map((item, index) => {
            return (
              <li key={index}>
                <a target="_blank" rel="noopener" href={item['path']}>
                  {item['title']}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h4>Sectors </h4>
        <ul>
          {feature.sectors.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </div>
    </div>
  ) : null;
}
