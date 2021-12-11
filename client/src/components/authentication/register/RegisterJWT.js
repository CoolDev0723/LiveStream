import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Autocomplete
} from '@material-ui/core';
import TimezoneSelect from 'react-timezone-select'
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';
import countries from '../../../utils/countries';
import './index.scss';

const RegisterJWT = (props) => {
  const mounted = useMounted();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [selectedCountry, setCountry] = useState('')
  const [selectedTimeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const initialvalues = {
    created: new Date(),
    email: '',
    name: '',
    phone: '',
    country: '',
    timezone: '',
    submit: null
  };

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup
    .object()
    .shape({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      phone: Yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('Phonenumber is required')
    });
  
  const handleTimeZone = (data) => {
    setTimeZone(data.value)
  }
  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      if(!selectedCountry || !selectedTimeZone)
        return
        console.log("----", selectedTimeZone)
      setStatus({ success: false });
      await register(values.email, values.name, values.phone, selectedCountry, selectedTimeZone);

      if (mounted.current) {
        setStatus({ success: true });
        setSubmitting(false);
        navigate('/notify');
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialvalues}
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
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            label="Phone"
            margin="normal"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.phone}
            variant="outlined"
          />
          <Autocomplete
            onChange={(event, value) => setCountry(value?.text)} 
            getOptionLabel={(option) => option?.text}
            options={countries}
            renderInput={(params) => (
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                variant="outlined"
                {...params}
              />
            )}
            sx={{ mt: 2 }}
          />
  
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TimezoneSelect
            value={selectedTimeZone}
            onChange={handleTimeZone}
          />
          {
            errors.submit &&
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
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default RegisterJWT;
