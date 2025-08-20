export const getPath = (url) =>
  url.startsWith('http') ? new URL(url).pathname : url;

export const formatItemType = (item) => {
  const type =
    item
      .replace('_', ' / ')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ') || '';
  return type;
};

export const doStringifySearchquery = (querystring) => {
  const params = new URLSearchParams(querystring);
  let obj = {};
  for (var key of params.keys()) {
    obj[key] = params.getAll(key);
  }
  return JSON.stringify(obj);
};

export const deStringifySearchquery = (searchparamstring) => {
  const obj = JSON.parse(searchparamstring);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    for (const el of value) {
      params.append(key, el);
    }
  }
  return params.toString();
};

export const stripprefixPathTeaser = ({
  block,
  data,
  id,
  onChangeBlock,
  value,
}) => {
  let dataSaved = {
    ...data,
    [id]: value,
  };
  if (id === 'href' && !isEmpty(value)) {
    dataSaved = {
      ...dataSaved,
      href: [
        {
          ...value[0],
          '@id': value[0]['@id'].replace(config.settings.prefixPath, ''),
        },
      ],
    };
  }

  if (id === 'href' && !isEmpty(value) && !data.title && !data.description) {
    dataSaved = {
      ...dataSaved,
      title: value[0].Title,
      description: value[0].Description,
      head_title: value[0].head_title,
    };
  }
  onChangeBlock(block, dataSaved);
};
