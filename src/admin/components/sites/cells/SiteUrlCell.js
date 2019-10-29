import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const defaultPrefix = new RegExp(`^${window.location.origin}[/]?|http[s]?://`);
const defaultPostfix = '/';

const SiteUrlCell = ({ url, prefix = defaultPrefix, postfix = defaultPostfix }) => {
  const trimmedUrl = useMemo(() => {
    if (!url) {
      return '';
    }

    let result = url;

    if (prefix) {
      const match = url.match(prefix);

      if (match && match.index === 0) {
        result = result.slice(match[0].length);
      }
    }

    if (postfix) {
      const match = [...url.matchAll(postfix)].pop();

      if (match && match.index + match[0].length === url.length) {
        result = result.slice(0, -match[0].length);
      }
    }

    return result || url;
  }, [url, prefix, postfix]);

  if (!url) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {trimmedUrl}
    </a>
  );
};

SiteUrlCell.propTypes = {
  url: PropTypes.string,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  postfix: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
};

export default SiteUrlCell;
