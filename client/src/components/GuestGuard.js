import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if(user.type == 'broadcaster'){
      return <Navigate to="/broadcaster" />;
    } else {
      return <Navigate to="/admin" />;
    }
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
