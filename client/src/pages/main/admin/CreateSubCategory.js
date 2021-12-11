import * as Yup from 'yup';
import { Formik } from 'formik';
import { useCallback, useState, useEffect } from 'react';
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

import { adminSubCategoryApi } from '../../../apis/adminSubCategoryApi';
import { adminCategoryApi } from '../../../apis/adminCategoryApi';
import useMounted from '../../../hooks/useMounted';

const CreateCategory = (props) => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const [cat, setCatetoryList] = useState([]);
  const {state} = useLocation();
  const [selectedCat, setCategory] = useState('');

  const getCatData = useCallback(async () => {
    try {
      const catData = await adminCategoryApi.getAllCat();

      if (mounted.current) {
        setCatetoryList(catData);
        if(state&&state.subcategory){
          setCategory(state.subcategory.category)
        }else{
          if(catData && catData.length > 0){
            setCategory(catData[0].name)
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  })

  useEffect(() => {
    getCatData();
  }, []);

  const onCategory = () => {
    navigate('/admin/subcategories');
  };

  const initialvalues = {
    subCategory: state&&state.subcategory ? state.subcategory.subCategory : '',
    category: state&&state.subcategory ? state.subcategory.category : '@#$%^&*',
  };

  const validationSchema = Yup
    .object()
    .shape({
      subCategory: Yup
        .string()
        .required('Name is required')
    });

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      values.category = selectedCat;

      if(!values.category || values.category ==''){
        alert("No Category")
        return
      }
        
      const category = values.category
      if(state&&state.subcategory){
        await adminSubCategoryApi.editSubCategory(state.subcategory._id, values.category, values.subCategory);
      }else{
        await adminSubCategoryApi.createSubCat({ category, subCategory: values.subCategory });
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
                        fullWidth
                        label="Category"
                        name="category"
                        onChange={(event) => { setCategory(event.target.value)}}
                        select
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: !!values.category }}
                        value={selectedCat}
                        variant="outlined"
                        sx={{ mt: 2 }}
                      >
                        {cat.map((cat) => (
                          <option
                            key={cat._id}
                            value={cat.name}
                          >
                            {cat.name}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        error={Boolean(touched.subCategory && errors.subCategory)}
                        fullWidth
                        label="Sub Category"
                        margin="normal"
                        name="subCategory"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.subCategory}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid sx={{ mt: 3}} item md={3} xs={12}>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        fullWidth
                        
                      >
                        {state&&state.subcategory ?'Update' :'Create'}
                      </Button>
                    </Grid>
                    <Grid sx={{ mt: 3 }} item md={3} xs={12}>
                      <Button
                        onClick={onCategory}
                        color="primary"
                        size="large"
                        type="submit"
                        variant="contained"
                        fullWidth
                  
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
