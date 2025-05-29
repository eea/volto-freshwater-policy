import React, { useRef } from 'react';
import { addAppURL } from '@plone/volto/helpers';
// import config from '@plone/volto/registry';
import superagent from 'superagent';

import './style.less';

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
    console.error('Error fetching data:', err);
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
    const numA = parseInt(a.match(/BP(\d+)/)?.[1] ?? 0, 10);
    const numB = parseInt(b.match(/BP(\d+)/)?.[1] ?? 0, 10);
    return numA - numB;
  });

  const filteredData = rawData.filter((item) => item.sector === selectedSector);
  const rowLabels = filteredData
    .map((item) => `${item.code} - ${item.title}`)
    .sort((a, b) => {
      const numA = parseInt(a.match(/BP(\d+)/)?.[1] ?? 0, 10);
      const numB = parseInt(b.match(/BP(\d+)/)?.[1] ?? 0, 10);
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
  const { sector, benefit, variation } = data || {};
  const [benefitsData, setBenefitsData] = React.useState([]);

  React.useEffect(() => {
    fetchBenefitsData().then(setBenefitsData);
  }, [setBenefitsData]);

  const { rowLabels, columnLabels, tableData } = filterFormatBenefitsData(
    benefitsData,
    sector,
    benefit,
  );
  console.log(sector, benefit);
  console.log(benefitsData);
  console.log(tableData);

  return (
    <div className="table-container">
      <table className="ecosystem-table">
        <thead>
          <tr>
            <th className="column-header"> </th>
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
                    <td key={j} className={`cell ${val}`}></td>
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
