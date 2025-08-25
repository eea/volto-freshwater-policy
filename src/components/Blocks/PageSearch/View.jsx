import { Input } from 'semantic-ui-react';
import { useEffect, useState } from 'react';

function View() {
  const [pageDocumentHeight, setPageDocumentHeight] = useState(0);
  const [pageSearchInput, setPageSearchInput] = useState(0);

  useEffect(() => {
    const pageDocument = document.getElementById('page-document');
    const pageSearchInput = document.getElementById('pageSearchInput');

    if (!pageDocument) {
      return;
    }

    if (pageDocument) {
      const { height } = pageDocument.getBoundingClientRect();
      console.log({ height });
      setPageDocumentHeight(height);
    }

    if (pageSearchInput) {
      const { height } = pageSearchInput.getBoundingClientRect();
      setPageSearchInput(height);
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        setPageDocumentHeight(height);
      }
    });

    observer.observe(pageDocument);

    return () => observer.disconnect(); // cleanup
  }, []);

  return (
    <div className="pageSearch">
      <div id="pageSearchInput">
        <Input fluid icon="search" placeholder="Search page content" />
      </div>
      <div
        className="pageSearchContent"
        style={{ height: pageDocumentHeight - pageSearchInput }}
      >
        Some content
      </div>
    </div>
  );
}

export default View;
