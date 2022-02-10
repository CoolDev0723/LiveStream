import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../apis/authApi';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    console.log("log in user", user)
    // return {
    //   ...state,
    //   isAuthenticated: true,
    //   user
    // };
    window.localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    console.log("registered user", user)
    window.localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

const AuthContext = createContext({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  activateEmail: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          const user = await authApi.me(accessToken);

          if (!state.isAuthenticated) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user
              }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email) => {
    const response = await authApi.login(email);

    // const user = response.user;

    // window.localStorage.setItem('accessToken', response.token);
    // window.localStorage.setItem('user', JSON.stringify(user));
    // dispatch({
    //   type: 'LOGIN',
    //   payload: {
    //     isAuthenticated: true,
    //     user
    //   }
    // });
  };

  const logout = async () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, phone, country, timezone) => {
    await authApi.register({ email, name, phone, country, timezone });
  };
  
  const navigate = useNavigate();

  const activateEmail = async (token, isLogin) => {
    const response = await authApi.activateEmail(token, isLogin);
    if(response == "error"){
      navigate('/login');
    } else {
      window.localStorage.setItem('accessToken', response.token);
      const user = response.user;
  
      dispatch({
        type: 'REGISTER',
        payload: {
          isAuthenticated: true,
          user
        }
      });
    }
  };

  const passwordRecovery = async (mail) => {
    await authApi.passwordRecovery(mail);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register,
        activateEmail,
        passwordRecovery
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
