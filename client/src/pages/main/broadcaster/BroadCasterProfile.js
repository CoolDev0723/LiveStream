import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '../../../lib/gtm';

const BroadCasterProfile = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
    </>
  );
};

export default BroadCasterProfile;
