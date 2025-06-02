import React from 'react';
import { addAppURL } from '@plone/volto/helpers';
// import config from '@plone/volto/registry';
import superagent from 'superagent';
import cx from 'classnames';

import './style.less';

const rowSpan = {
  biophysical_impacts: 3,
  ecosystem_services: 2,
  policy_objectives: 2,
};

const renderCircles = (effect) => {
  const circleCount =
    effect === 'High'
      ? 3
      : effect === 'Medium'
      ? 2
      : effect === 'Low'
      ? 1
      : effect === 'Negative'
      ? 1
      : 0;
  const circleClass = effect; // 'high', 'medium', or 'low'

  return (
    <div className="circle-container">
      {Array.from({ length: circleCount }).map((_, index) => (
        <span key={index} className={`circle ${circleClass}`}></span>
      ))}
    </div>
  );
};

const benefitsDataUrl = '/@@get-benefits-table-data';

const fetchBenefitsData = async () => {
  try {
    const resp = await superagent
      .get(addAppURL(benefitsDataUrl))
      .set('accept', 'json');
    return JSON.parse(resp.text);
  } catch (err) {
    // console.error('Error fetching data:', err);
  }
};

const filterFormatBenefitsData = (rawData, selectedSector, benefit) => {
  const columnSet = new Set();
  rawData.forEach((item) => {
    item[benefit].forEach(([code, label]) => {
      columnSet.add(`${code} - ${label}`);
    });
  });

  const columnLabels = Array.from(columnSet).sort((a, b) => {
    const numA = parseInt(a.match(/(\d+)/)?.[1] ?? 0, 10);
    const numB = parseInt(b.match(/(\d+)/)?.[1] ?? 0, 10);
    return numA - numB;
  });

  const filteredData = rawData.filter((item) => item.sector === selectedSector);
  const rowLabels = filteredData
    .map((item) => `${item.code} - ${item.title}`)
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] ?? 0, 10);
      const numB = parseInt(b.match(/(\d+)/)?.[1] ?? 0, 10);
      return numA - numB;
    });

  const tableData = filteredData.map((item) => {
    const valueMap = new Map(
      item[benefit].map(([code, label, value]) => [
        `${code} - ${label}`,
        value,
      ]),
    );

    return columnLabels.map((col) => valueMap.get(col) || 'None');
  });

  return { rowLabels, columnLabels, tableData };
};

const NWRMBenefitsTable = (props) => {
  const { data } = props;
  const { sector, benefit, variation, tableSize } = data || {};
  const [benefitsData, setBenefitsData] = React.useState([]);

  React.useEffect(() => {
    fetchBenefitsData().then(setBenefitsData);
  }, [setBenefitsData]);

  const { rowLabels, columnLabels, tableData } = filterFormatBenefitsData(
    benefitsData,
    sector,
    benefit,
  );
  // console.log(sector, benefit, tableSize);
  // console.log(benefitsData);
  // console.log(tableData);

  return (
    <div className={cx('table-container', variation)}>
      <table className="ecosystem-table">
        <thead>
          <tr>
            <th rowSpan={rowSpan[benefit]} className="column-header">
              <div className="legend">
                {variation === 'circle' ? (
                  <div>
                    <div class="circle-container">
                      <span class="circle High"></span>
                      <span class="circle High"></span>
                      <span class="circle High"></span>
                      <span>High</span>
                    </div>
                    <div class="circle-container">
                      <span class="circle Medium"></span>
                      <span class="circle Medium"></span>
                      <span>Medium</span>
                    </div>
                    <div class="circle-container">
                      <span class="circle Low"></span>
                      <span>Low</span>
                    </div>
                    <div class="circle-container">
                      <span class="circle Negative"></span>
                      <span>Negative</span>
                    </div>
                  </div>
                ) : (
                  <div className="legend-wrapped">
                    <div className="legend-row">
                      <span className="legend-box High"></span>High
                    </div>
                    <div className="legend-row">
                      <span className="legend-box Medium"></span>Medium
                    </div>
                    <div className="legend-row">
                      <span className="legend-box Low"></span>Low
                    </div>
                    <div className="legend-row">
                      <span className="legend-box Negative"></span>Negative
                    </div>
                  </div>
                )}
              </div>
            </th>
            {benefit === 'ecosystem_services' && (
              <>
                <th colSpan={3} className="column-section">
                  Provisioning
                </th>
                <th colSpan={6} className="column-section">
                  Regulatory and maintenance
                </th>
                <th colSpan={2} className="column-section">
                  Cultural
                </th>
                <th colSpan={3} className="column-section">
                  Abiotic
                </th>
              </>
            )}
            {benefit === 'biophysical_impacts' && (
              <>
                <th colSpan={7} className="column-section">
                  Mechanisms of water retention
                </th>
                <th colSpan={10} className="column-section">
                  Biophysical impacts resulting from water retention
                </th>
              </>
            )}
            {benefit === 'policy_objectives' && (
              <>
                <th colSpan={8} className="column-section">
                  Water Framework Directive
                </th>
                <th colSpan={1} className="column-section">
                  FD
                </th>
                <th colSpan={1} className="column-section">
                  HD & BD
                </th>
                <th colSpan={4} className="column-section">
                  2020 Biodiversity strategy
                </th>
              </>
            )}
          </tr>
          {benefit === 'biophysical_impacts' && (
            <tr>
              <th colSpan={4} className="column-section">
                Slowing and storing runoff
              </th>
              <th colSpan={3} className="column-section">
                Reducing runoff
              </th>
              <th colSpan={2} className="column-section">
                Reducing pollution
              </th>
              <th colSpan={2} className="column-section">
                Soil conservation
              </th>
              <th colSpan={3} className="column-section">
                Creating habitat
              </th>
              <th colSpan={3} className="column-section">
                Climate alteration
              </th>
            </tr>
          )}
          <tr>
            {columnLabels.map((label, i) => (
              <th key={i} className="column-header">
                {label}
                {/* <div>{label}</div> */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rowLabel, i) => (
            <tr key={i}>
              <td className="row-header">{rowLabel}</td>
              {tableData[i].map(
                (val, j) =>
                  variation === 'circle' ? (
                    <td>{renderCircles(val)}</td>
                  ) : (
                    <td key={j} className={cx('cell', val)}></td>
                  ),
                // <td>{renderCircles(val)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NWRMBenefitsTable;
