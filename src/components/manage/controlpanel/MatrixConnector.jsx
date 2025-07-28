import { Segment, Header } from 'semantic-ui-react';

function MatrixConnector() {
  useEffect(() => {
    console.log('MATRIC CONNECTOR LOADED');
  }, []);
  return (
    <Segment padded>
      <Header as="h1">My Addon Settings</Header>
      <p>This is your custom control panel.</p>
    </Segment>
  );
}

export default MatrixConnector;
