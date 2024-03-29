// Original: https://github.com/eea/volto-searchlib/blob/master/searchlib/components/Result/HorizontalCardItem.jsx
// We need to replace the EEA Topics to WISE Topics
import React from 'react';
import { Label } from 'semantic-ui-react';
import {
  SegmentedBreadcrumb,
  StringList,
  DateTime,
} from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';

import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import ContentClusters from '@eeacms/search/components/Result/ContentClusters';

const ExtraContent = (props) => {
  const { result, vocab } = props;
  const wise_topics = result?._result?.category?.raw;
  return (
    <div>
      <div className="result-bottom">
        <div className="result-info">
          <DateTime format="DATE_MED" value={result.issued} />
        </div>
        {wise_topics && wise_topics.length > 0 && (
          <div className="result-info">
            <span className="result-info-title">WISE Topics: </span>
            <StringList value={result?._result?.category?.raw} />
          </div>
        )}
      </div>
      <div>
        <div className="result-info result-source">
          <span className="result-info-title">Source: </span>
          <ExternalLink href={result.href}>
            <strong title={result.source} className="source">
              {firstWords(
                getTermDisplayValue({
                  vocab,
                  field: 'cluster_name',
                  term: result.source,
                }),
                8,
              )}
            </strong>
            <SegmentedBreadcrumb
              href={result.href}
              short={true}
              maxChars={40}
            />
          </ExternalLink>
        </div>
      </div>
    </div>
  );
};

const ResourceCatalogItem = (props) => {
  const { result } = props;
  const { appConfig, registry } = useAppConfig();
  const { vocab = {} } = appConfig;
  const clusters = result.clusterInfo;

  const UniversalCard = registry.resolve['UniversalCard'].component;

  const item = {
    '@id': result.href,
    title: (
      <>
        <ExternalLink href={result.href} title={result.title}>
          {result.title}
          {result.isNew && <Label className="new-item">New</Label>}
          {result.isExpired && (
            <Label className="archived-item">Archived</Label>
          )}
        </ExternalLink>
      </>
    ),
    meta: <ContentClusters clusters={clusters} item={result} />,
    description: props.children ? props.children : <ResultContext {...props} />,
    preview_image_url: result.hasImage ? result.thumbUrl : undefined,
    extra: <ExtraContent result={result} vocab={vocab} />,
  };

  const itemModel = {
    hasImage: result.hasImage,
    hasDescription: true,
    imageOnRightSide: true,
    '@type': 'searchItem',
  };

  return <UniversalCard item={item} itemModel={itemModel} />;
};

export default ResourceCatalogItem;
