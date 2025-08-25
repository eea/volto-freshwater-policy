import { Input } from 'semantic-ui-react';

function View() {
  return (
    <div style={{ position: 'relative' }}>
      <Input fluid icon="search" placeholder="Search page content" />
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          height: '100%',
          border: '1px solid red',
          width: '100%',
          zIndex: 10,
        }}
      >
        Some content
      </div>
    </div>
  );
}

export default View;
