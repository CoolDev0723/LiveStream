import * as Yup from 'yup';
import { Formik } from 'formik';
import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  Card,
  CardContent,
  Autocomplete
} from '@material-ui/core';

import { adminEventApi } from '../../../apis/adminEventApi';
import { adminCategoryApi } from '../../../apis/adminCategoryApi';
import { adminSubCategoryApi } from '../../../apis/adminSubCategoryApi';
import useMounted from '../../../hooks/useMounted';
import countries from '../../../utils/countries';

const CreateEvent = (props) => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const [catList, setCatList] = useState([]);
  const [subCatList, setSubCatList] = useState([]);
  const [filteredSubCat, setFilterSubCat] = useState([]);
  const {state} = useLocation();
  const [selectedCountry, setCountry] = useState(state&&state.event? state.event.country : '')
  const [selectedSubCat, setSubCategory] = useState('');
  const [selectedCat, setCategory] = useState('');

  const getCatData = useCallback(async () => {
    try {
      const catData = await adminCategoryApi.getAllCat();
      const subCatData = await adminSubCategoryApi.getAllSubCat();
      if (mounted.current) {
        setCatList(catData);
        setSubCatList(subCatData);

        if( !state || !state.event){
          if(catData && catData.length > 0){
            setCategoryChange(catData[0].name, subCatData)
          }
        }else{
          setCategoryChange(state.event.category, subCatData)
          setSubCategory(state.event.subCat)
        }
      }
    } catch (err) {
      console.log(err);
    }
  })

  useEffect(() => {
    getCatData();
  }, []);

  const initialValues = {
    name: state&&state.event ? state.event.name : '',
    description: state&&state.event? state.event.description : '',
    category: state&&state.event? state.event.category : '@#$%^&*',
    subCat: state&&state.event? state.event.subCat : '@#$%^&*',
    country: state&&state.event? state.event.country : '',
    city: state&&state.event? state.event.city : '',
    state: state&&state.event? state.event.state : '',
    timeZone: state&&state.event? state.event.timeZone : ''
  };

  const setCategoryChange = (value, subCatData) => {
    setCategory(value)
    setSubCategoryChange(value, subCatData)
  }

  const setSubCategoryChange = (value, subCatData) => {
    const filterSubCategories = subCatData.filter(subCat => subCat.category === value);
    setFilterSubCat(filterSubCategories);
    if(filterSubCategories && filterSubCategories.length > 0)
      setSubCategory(filterSubCategories[0].subCategory);
  }

  const handleCategoryChange = (value) => {
      setCategory(value)
      changeSubCategory(value)
  }

  const changeSubCategory = (value) => {
    const filterSubCategories = subCatList.filter(subCat => subCat.category === value);
    setFilterSubCat(filterSubCategories);
    if(filterSubCategories && filterSubCategories.length > 0)
      setSubCategory(filterSubCategories[0].subCategory);
  }

  const validationSchema = Yup
    .object()
    .shape({
      name: Yup
        .string()
        .required('Name is required'),
    });

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      values.subCat = selectedSubCat;
      values.category = selectedCat;
      values.country = selectedCountry

      console.log("api parmas", values)

      if(state && state.event){
        values = {...values, id : state.event._id}
        await adminEventApi.updateEvent(values);
      }else{
        await adminEventApi.createEvent(values);
      }
      
      navigate('/admin');
      if (mounted.current) {
        setStatus({ success: true });
        setSubmitting(false);
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
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {
        ({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
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
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        label="Event Name"
                        margin="normal"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Event Description"
                        margin="normal"
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Category"
                        name="category"
                        onChange={(event) => {handleCategoryChange(event.target.value)}}
                        select
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: !!values.category }}
                        value={selectedCat}
                        variant="outlined"
                        sx={{ mt: 2 }}
                      >
                        {catList.map((category) => (
                          <option
                            key={category._id}
                            value={category.name}
                          >
                            {category.name}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        label="Sub Category"
                        name="subCat"
                        onChange={
                          event => {
                            setSubCategory(event.target.value)
                          }
                        }
                        select
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: !!values.subCat }}
                        value={selectedSubCat}
                        variant="outlined"
                        sx={{ mt: 3 }}
                      >
                        {filteredSubCat.map((subCategory) => (
                          <option
                            key={subCategory._id}
                            value={subCategory.subCategory}
                          >
                            {subCategory.subCategory}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        onChange={(event, value) => setCountry(value.text)} 
                        defaultValue = {countries.find(item => item.text == values.country)}
                        getOptionLabel={(option) => option.text}
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
                        error={Boolean(touched.state && errors.state)}
                        fullWidth
                        helperText={touched.state && errors.state}
                        label="City"
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.city}
                        variant="outlined"
                        sx={{ mt: 3 }}
                      />
                      <TextField
                        error={Boolean(touched.state && errors.state)}
                        fullWidth
                        helperText={touched.state && errors.state}
                        label="State/Region"
                        name="state"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.state}
                        variant="outlined"
                        sx={{ mt: 3 }}
                      />
                      <TextField
                        error={Boolean(touched.state && errors.state)}
                        fullWidth
                        helperText={touched.state && errors.state}
                        label="TimeZone"
                        name="timeZone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.timeZone}
                        variant="outlined"
                        sx={{ mt: 3 }}
                      />
                    </Grid>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ pl: 10, pr: 10, ml:5, mr:5, mt: 3 }}
                    >
                      {state && state.event ? 'Update' : 'Create'}
                    </Button>
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
    </Formik>
  );
};

export default CreateEvent;
