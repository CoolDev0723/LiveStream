import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import numeral from 'numeral';

import {
  Box,
  Card,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  Button
} from '@material-ui/core';

import useMounted from '../../../hooks/useMounted';
import { adminSubCategoryApi } from '../../../apis/adminSubCategoryApi';
import gtm from '../../../lib/gtm';

import Scrollbar from '../../../components/Scrollbar';
import SearchIcon from '../../../icons/Search';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/DeleteIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const SubCategory = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const [catList, getCatList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    status: null
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSubCategory] = useState('');

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getData = useCallback(async () => {
    try {
      const data = await adminSubCategoryApi.getAllSubCat();

      if (mounted.current) {
        getCatList(data);
      }
    } catch (err) {
      console.log(err);
    }
  })

  const handleClickOpen = (id) => {
    setSubCategory(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onDeleteSubCategory()
  };

  const onDeleteSubCategory = async() => {
    try{
      await adminSubCategoryApi.deleteSubCategory(selectedId);
      getData();
    } catch (err){
      console.log(err);
    }
  }

  const onEditSubCategory = async(subcategory) => {
    navigate('/admin/create_sub_category', {state : {subcategory}});
  }

  useEffect(() => {
    getData();
  }, []);

  const applyFilters = (catList, query, filters) => catList
    .filter((cat) => {
      let matches = true;

      if (cat) {
        const properties = ['category'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (cat[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
      }

      if (filters.status && cat.status !== filters.status) {
        matches = false;
      }

      return matches;
    });

  const applyPagination = (catList, page, limit) => catList
    .slice(page * limit, page * limit + limit);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const onCreateCategory = () => {
    navigate('/admin/create_sub_category');
  }

  // Usually query is done on backend with indexing solutions
  const filteredCatList = applyFilters(catList, query, filters);
  const paginatedCatList = applyPagination(filteredCatList, page, limit);

  return (
    <>
      <Helmet>
        <title>Sub Category</title>
      </Helmet>
      <Box sx={{ flex: 1, mt: 8, marginInline: 30 }}>
        <Scrollbar>
          <Card>
            <Box sx={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box
                sx={{
                  m: 1,
                  width: 500,
                }}
              >
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  onChange={handleQueryChange}
                  placeholder="Search by name"
                  value={query}
                  variant="outlined"
                />
              </Box>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                sx={{ height: 40, mr: 6 }}
                onClick={onCreateCategory}
              >
                + New Category
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Sub Category ID
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Category Name
                  </TableCell>
                  <TableCell>

                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCatList.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      '&:last-child td': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell>
                      {item._id}
                    </TableCell>
                    <TableCell>
                      {item.subCategory}
                    </TableCell>
                    <TableCell>
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => {handleClickOpen(item._id)}}
                        sx={{}}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => {onEditSubCategory(item)}}
                        sx={{}}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Scrollbar>
        <TablePagination
          component="div"
          count={filteredCatList.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure to delete this subcategory?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => {setOpen(false)}} color="primary">
              No
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SubCategory;
