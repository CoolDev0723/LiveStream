import { Suspense, lazy } from 'react';
import GuestGuard from './components/GuestGuard';
import AuthGuard from './components/AuthGuard';

import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/MainLayout';
import AdminDashboardLayout from './components/dashboard/AdminDashboardLayout';
import BroadCasterDashboardLayout from './components/dashboard/BroadCasterDashboardLayout';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// Home Page
const Home = Loadable(lazy(() => import('./pages/home/HomePage')));

// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
const ActivateEmail = Loadable(
  lazy(() => import('./components/authentication/activate'))
);
const PasswordRecovery = Loadable(
  lazy(() => import('./pages/authentication/PasswordRecovery'))
);
const PasswordReset = Loadable(
  lazy(() => import('./pages/authentication/PasswordReset'))
);
const Register = Loadable(
  lazy(() => import('./pages/authentication/Register'))
);
const VerifyCode = Loadable(
  lazy(() => import('./pages/authentication/VerifyCode'))
);

// Error pages

const AuthorizationRequired = Loadable(
  lazy(() => import('./pages/AuthorizationRequired'))
);
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));
const Notify = Loadable(lazy(() => import('./pages/Notify')));

// Main BroadCaster pages
const BroadCasterHome = Loadable(
  lazy(() => import('./pages/main/broadcaster/BroadCasterHome'))
);
const BroadCasterProfile = Loadable(
  lazy(() => import('./pages/main/broadcaster/BroadCasterProfile'))
);
const BroadCasterPayment = Loadable(
  lazy(() => import('./pages/main/broadcaster/BroadCasterPayment'))
);
const BroadCastScreen = Loadable(
  lazy(() => import('./pages/main/broadcaster/BroadCastScreen'))
);

// Main Admin pages
const AdminHome = Loadable(lazy(() => import('./pages/main/admin/AdminHome')));
const AdminUserManage = Loadable(
  lazy(() => import('./pages/main/admin/AdminUser'))
);
const AdminCatManage = Loadable(
  lazy(() => import('./pages/main/admin/Category'))
);
const AdminSubCatManage = Loadable(
  lazy(() => import('./pages/main/admin/SubCategory'))
);
const AdminCreateEvent = Loadable(
  lazy(() => import('./pages/main/admin/CreateEvent'))
);
const AdminCreateCategory = Loadable(
  lazy(() => import('./pages/main/admin/CreateCategory'))
);
const AdminCreateSubCategory = Loadable(
  lazy(() => import('./pages/main/admin/CreateSubCategory'))
);

const routes = [
  {
    path: '*',
    children: [
      {
        path: '/login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'activate/:token',
        element: (
          <GuestGuard>
            <ActivateEmail isLogin={false} />
          </GuestGuard>
        ),
      },
      {
        path: 'activateLogin/:token',
        element: (
          <GuestGuard>
            <ActivateEmail isLogin={true} />
          </GuestGuard>
        ),
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: 'password-reset',
        element: <PasswordReset />,
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'register-unguarded',
        element: <Register />,
      },
      {
        path: 'verify-code',
        element: <VerifyCode />,
      },
    ],
  },
  {
    path: 'broadcaster',
    element: (
      <AuthGuard>
        <BroadCasterDashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <BroadCasterHome />,
      },
      {
        path: 'profile',
        element: <BroadCasterProfile />,
      },
      {
        path: 'payment',
        element: <BroadCasterPayment />,
      },
      {
        path: 'broadcast',
        element: <BroadCastScreen />,
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <AuthGuard>
        <AdminDashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <AdminHome />,
      },
      {
        path: '/users',
        element: <AdminUserManage />,
      },
      {
        path: '/categories',
        element: <AdminCatManage />,
      },
      {
        path: '/subcategories',
        element: <AdminSubCatManage />,
      },
      {
        path: '/createevent',
        element: <AdminCreateEvent />,
      },
      {
        path: '/createcategory',
        element: <AdminCreateCategory />,
      },
      {
        path: '/create_sub_category',
        element: <AdminCreateSubCategory />,
      },
    ],
  },
  {
    path: '*',
    // element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <GuestGuard>
            <Home />
          </GuestGuard>
        ),
      },
      {
        path: '/notify',
        element: <Notify />,
      },
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
