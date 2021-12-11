import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';
import { useNavigate } from 'react-router-dom';

const LoginJWT = (props) => {
  const mounted = useMounted();
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    submit: null
  };

  const validationSchema = Yup
    .object()
    .shape({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required')
    });
  

  const onSubmit = async (
    values,
    {
      setErrors,
      setStatus,
      setSubmitting
    }
  ) => {
    try {
      await login(values.email);

      // if (mounted.current) {
      //   setStatus({ success: true });
      //   setSubmitting(false);
      // }

      if (mounted.current) {
        setStatus({ success: true });
        setSubmitting(false);
        navigate('/notify');
      }
    } catch (err) {
      if (mounted.current) {
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          {...props}
        >
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            variant="outlined"
          />
          {/* <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          /> */}
          {errors.submit &&
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          }
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
