import { useCallback, useState } from 'react';
import { useEffect } from 'react';
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
  TablePagination
} from '@material-ui/core';

import useMounted from '../../../hooks/useMounted';
import { adminUserApi } from '../../../apis/adminUserApi';
import gtm from '../../../lib/gtm';

import Scrollbar from '../../../components/Scrollbar';
import SearchIcon from '../../../icons/Search';
import DeleteIcon from '../../../icons/DeleteIcon';
import EditIcon from '../../../icons/EditIcon';
import Label from '../../../components/Label';

const AdminUser = () => {
  const mounted = useMounted();
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    status: null
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const data = await adminUserApi.getAllUser();

      if (mounted.current) {
        setUserList(data);
      }
    } catch (err) {
      console.log(err);
    }
  })

  useEffect(() => {
    getUsers();
  }, []);

  const applyFilters = (userList, query, filters) => userList
    .filter((user) => {
      let matches = true;

      if (user) {
        const properties = ['name', 'email'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (user[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
      }

      if (filters.status && user.status !== filters.status) {
        matches = false;
      }

      return matches;
    });

  const applyPagination = (userList, page, limit) => userList
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

  // Usually query is done on backend with indexing solutions
  const filteredUserList = applyFilters(userList, query, filters);
  const paginatedUserList = applyPagination(filteredUserList, page, limit);

  return (
    <>
      <Helmet>
        <title>User</title>
      </Helmet>
      <Box sx={{ flex: 1, mt: 8, marginInline: 30 }}>
        <Scrollbar>
          <Card>
            <Box
              sx={{
                m: 1,
                maxWidth: '100%',
                width: 500
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
                placeholder="Search by name or email"
                value={query}
                variant="outlined"
              />
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    User ID
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Email
                  </TableCell>
                  <TableCell>
                    Location
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUserList.map((item) => (
                  <TableRow
                    key={item.url}
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
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {item.email}
                    </TableCell>
                    <TableCell>
                      {item.country}
                    </TableCell>
                    <TableCell>
                      {
                        item.status &&
                        <Label color={'success'}>
                          Broadcasting
                        </Label>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Scrollbar>
        <TablePagination
          component="div"
          count={filteredUserList.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
};

export default AdminUser;
