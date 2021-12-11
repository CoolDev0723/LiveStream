import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const ActivateEmail = (props) => {
  const [message, setMessage] = useState('Loading.....')
  const { activateEmail } = useAuth();
  const params = useParams();

  useEffect(() => {
    const token = params.token;
    if (token) {
      activateEmail(token, props.isLogin);
    } else{
      setMessage('Invalid Activation Link')
    }
  }, []);

  return (
    <>{message}</>
  )
};

export default ActivateEmail;
