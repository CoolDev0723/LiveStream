import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import * as moment from 'moment/moment'
import { useMediaQuery } from 'react-responsive'

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
  Typography,
  TablePagination,
  Button,
  CircularProgress
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMounted from '../../../hooks/useMounted';
import {adminEventApi} from '../../../apis/adminEventApi';
import gtm from '../../../lib/gtm';
import Scrollbar from '../../../components/Scrollbar';
import SearchIcon from '../../../icons/Search';
import DeleteIcon from '../../../icons/DeleteIcon';
import EditIcon from '../../../icons/EditIcon';

const AdminHome = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    status: null
  });
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedEventId, setEventId] = useState("")

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getEvents = useCallback(async () => {
    try{
      setIsLoading(true)
      const data = await adminEventApi.getAllEvent();
      setIsLoading(false)
      if(mounted.current){
        setEventList(data);
      }
    } catch (err){
      console.log(err);
    }
  })


  useEffect(() => {
    getEvents();
  }, []);

  const applyFilters = (eventList, query, filters) => eventList
    .filter((event) => {
      let matches = true;

      if (query) {
     
        let containsQuery = false;

        if (event.name.toLowerCase().includes(query.toLowerCase())
        || event.category.toLowerCase().includes(query.toLowerCase())
        || event.subCat.toLowerCase().includes(query.toLowerCase())
        || event._id.toLowerCase().includes(query.toLowerCase())
        || event.country.toLowerCase().includes(query.toLowerCase())
        || event.timeZone.toLowerCase().includes(query.toLowerCase())
        || event.city.toLowerCase().includes(query.toLowerCase())
        || event.state.toLowerCase().includes(query.toLowerCase())
        || event.created_date.toLowerCase().includes(query.toLowerCase())
        ) {
          containsQuery = true;
        }

        if (!containsQuery) {
          matches = false;
        }
      }

      if (filters.status && event.status !== filters.status) {
        matches = false;
      }

      return matches;
    });

  const applyPagination = (eventList, page, limit) => eventList
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

  const onCreateEvent = () => {
    navigate('/admin/createevent');
  }

  const onEditEvent = (event) => {
    navigate('/admin/createevent', {state : {event}});
  }

  const handleClickOpen = (eventId) => {
    setEventId(eventId)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onDeleteEvent()
  };

  const onDeleteEvent = async() => {
    const user = window.localStorage.getItem('user')
    if(selectedEventId && user){
      try{
        // const userObj = JSON.parse(user)
        await adminEventApi.deleteEvent(selectedEventId);
        getEvents();
      } catch (err){
        console.log(err);
      }
    }
  }
  
  // Usually query is done on backend with indexing solutions
  const filteredeventList = applyFilters(eventList, query, filters);
  const paginatedeventList = applyPagination(filteredeventList, page, limit);

  return (
    <>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <Box sx={{flex: 1, mt: 8, marginInline: 30}}>
        <Scrollbar>
          <Card>
              <Box sx={{flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                    placeholder="Search"
                    value={query}
                    variant="outlined"
                  />
                </Box>
                <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    sx={{height: 40, mr: 6}}
                    onClick={onCreateEvent}
                  >
                    + New Event
                </Button>
              </Box>
              
              <Table>
                <TableHead>
                  <TableRow>
                    {
                      !isTabletOrMobile &&
                      <TableCell>
                        Event Id
                      </TableCell>
                    }
                    <TableCell>
                      Event Name
                    </TableCell>
                    {
                      !isTabletOrMobile &&
                      <TableCell>
                        Created Date
                      </TableCell>
                    }
                    <TableCell>
                      Category
                    </TableCell>
     
                    <TableCell>
                      Sub Category
                    </TableCell>
                    
                   {!isTabletOrMobile &&
                    <TableCell>
                      Stage
                    </TableCell>
                   }
                   {
                     !isTabletOrMobile &&
                     <TableCell>
                        Country
                      </TableCell>
                   }
                   {
                     !isTabletOrMobile &&
                     <TableCell>
                      City
                    </TableCell>
                   }
                   {
                     !isTabletOrMobile &&
                     <TableCell>
                      Timezone
                    </TableCell>
                   }    
                    <TableCell>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedeventList.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td': {
                          border: 0
                        }
                      }}
                    >
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {item._id}
                        </TableCell>
                      }
                      <TableCell>
                        {item.name}
                      </TableCell>
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {moment(item.created_date).format('MM/DD/YYYY')}
                        </TableCell>
                      }
                      <TableCell>
                        {item.category}
                      </TableCell>

                      <TableCell>
                        {item.subCat}
                      </TableCell>
                      
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {item.state}
                        </TableCell>
                      }
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {item.country}
                        </TableCell>
                      }
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {item.city}
                        </TableCell>
                      }
                      
                      {
                        !isTabletOrMobile &&
                        <TableCell>
                          {item.timeZone}
                        </TableCell>
                      }
                      
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
                          onClick={() => {onEditEvent(item)}}
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
          count={filteredeventList.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
        {isLoading &&
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <CircularProgress/>
          </Box>
        }
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure to delete this event?"}</DialogTitle>
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

export default AdminHome;
