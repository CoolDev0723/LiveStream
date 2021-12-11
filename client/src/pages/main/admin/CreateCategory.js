import * as Yup from 'yup';
import { Formik } from 'formik';
import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  Card,
  CardContent
} from '@material-ui/core';

import { adminCategoryApi } from '../../../apis/adminCategoryApi';
import useMounted from '../../../hooks/useMounted';

const CreateCategory = (props) => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const {state} = useLocation();

  const onCategory = () => {
    navigate('/admin/categories');
  };

  const initialvalues = {
    name: state&&state.name ? state.name : '',
  };

  const validationSchema = Yup
    .object()
    .shape({
      name: Yup
        .string()
        .required('Name is required'),
    });

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      if(state&&state.name){
        await adminCategoryApi.editCategory(state.name, values.name);
      }else{
        await adminCategoryApi.createCat({ name: values.name });
      }

      if (mounted.current) {
        setStatus({ success: true });
        setSubmitting(false);
        onCategory();
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
      {
        ({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          touched,
          values
        }) => (
          <Box
            sx={{ mr: 3, ml: 2, mt: 8 }}>
            <Card>
              <CardContent>
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  {...props}
                >
                  <Grid container spacing={6} justifyContent="center">
                    <Grid item md={4} xs={12}>
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        label="Category Name"
                        margin="normal"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                      >
                        {state&&state.name ? 'Update' : 'Create'}
                      </Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Button
                        onClick={onCategory}
                        color="primary"
                        size="large"
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                  )}
                </form>
              </CardContent>
            </Card>
          </Box>
        )
      }
    </Formik >
  );
};

export default CreateCategory;
