import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '../../../lib/gtm';

const BroadCasterPayment = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment</title>
      </Helmet>
    </>
  );
};

export default BroadCasterPayment;
