import { useState } from 'react';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import * as moment from 'moment/moment';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  Input,
  Slide,
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
  Button,
  Typography,
  // , Checkbox
} from '@material-ui/core';
import useMounted from '../../../hooks/useMounted';
import { broadcasterEventApi } from '../../../apis/broadcasterEventApi';
import gtm from '../../../lib/gtm';
import Scrollbar from '../../../components/Scrollbar';
import SearchIcon from '../../../icons/Search';
import EditIcon from '../../../icons/EditIcon';
import RecordIcon from '../../../icons/RecordIcon';
import { useMediaQuery } from 'react-responsive';
// import Rating from '@material-ui/lab/Rating';
// import { adminEventApi } from '../../../apis/adminEventApi';

const BroadCasterHome = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ status: null });
  const [isShowLangDlg, setShowLangDlg] = React.useState(false);
  const [langList, setLangList] = useState([]);
  const [selectedEvent, setEvent] = useState('');
  const [selectedLang, setLanguage] = useState('');
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  // const [rating, setRating] = React.useState(0);

  const openLangDlg = async (eventId) => {
    // const user = window.localStorage.getItem('user')
    // console.log("user", user)
    // if(user){
    //   const userObj = JSON.parse(user)
    //   try{
    //     const data = await broadcasterEventApi.getRate(userObj.id, eventId);
    //     if(data.rating){
    //       setRating(parseFloat(data.rating))
    //     }
    //   }catch (err) {

    //   }
    setEvent(eventId);
    setShowLangDlg(true);
    // }
  };

  const closeLangDlgAndStart = () => {
    setShowLangDlg(false);
    onStartBroadCast();
  };

  const selectLang = (data) => {
    setLangList(data);
    setLanguage(data.length > 0 ? data[0].language : '');
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const getEvents = async () => {
    try {
      let userObj = null;
      const user = window.localStorage.getItem('user');
      if (user) {
        userObj = JSON.parse(user);
      }
      const data = await broadcasterEventApi.getAllEvent(
        userObj !== undefined && userObj != null && userObj.id !== undefined
          ? userObj.id
          : null
      );
      if (mounted.current) {
        setEventList(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getLanguage = async () => {
    try {
      const data = await broadcasterEventApi.getLanguage();
      if (mounted.current) {
        selectLang(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    getLanguage();
    getEvents();
  }, []);

  const applyFilters = (eventList, query, filters) =>
    eventList.filter((event) => {
      let matches = true;
      if (query) {
        const properties = ['name', 'email'];
        let containsQuery = false;
        properties.forEach((property) => {
          if (event.name.toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        });
        if (!containsQuery) {
          matches = false;
        }
      }
      if (filters.status && event.status !== filters.status) {
        matches = false;
      }
      return matches;
    });

  const applyPagination = (eventList, page, limit) =>
    eventList.slice(page * limit, page * limit + limit);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const onStartBroadCast = async () => {
    if (selectLang == '') {
      alert('No Selected Language');
      return;
    }
    if (navigator.mediaDevices) {
      try {
        const user = window.localStorage.getItem('user');
        if (user) {
          const userObj = JSON.parse(user);
          const res = await broadcasterEventApi.createBroadcastChannel({
            eventId: selectedEvent,
            userId: userObj.id,
            language: selectedLang,
          });
          console.log('res.data', res.data);
          navigate('/broadcaster/broadcast', {
            state: { streamId: res.data.streamId, selectedEvent },
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('No Media Device');
    }
  };

  const filteredeventList = applyFilters(eventList, query, filters);
  const paginatedeventList = applyPagination(filteredeventList, page, limit);

  // const handleChangeReservationStatus = (e, event) => {
  //   let cur_eventList = eventList;
  //   let update_event = event;
  //   update_event.id = update_event._id;
  //   delete update_event.broadcasts;
  //   delete update_event.numberOfBroadCasters;
  //   delete update_event.created_date;
  //   delete update_event._id;
  //   delete update_event.__v;
  //   cur_eventList.map(event=>{
  //     if(event._id == update_event.id){
  //       if (!e.target.checked) {
  //         update_event.isReservation = 0;
  //         event.isReservation = 0;
  //       } else {
  //         update_event.isReservation = 1;
  //         event.isReservation = 1;
  //       }
  //     }
  //   })
  //   adminEventApi.updateEvent(update_event);
  // };

  return (
    <>
      <Helmet>
        <title>Ipsum</title>
      </Helmet>
      <Box sx={{ flex: 1, mt: 8, marginInline: 30 }}>
        <Scrollbar>
          <Card>
            <Box
              sx={{
                flex: 1,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
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
                    ),
                  }}
                  onChange={handleQueryChange}
                  placeholder="Search by Event Name"
                  value={query}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  {!isTabletOrMobile && <TableCell>Created</TableCell>}
                  {!isTabletOrMobile && <TableCell>Updated</TableCell>}
                  <TableCell>Category</TableCell>
                  <TableCell>Sub Category</TableCell>
                  {!isTabletOrMobile && <TableCell>Stage</TableCell>}
                  {!isTabletOrMobile && <TableCell>Country</TableCell>}
                  {!isTabletOrMobile && <TableCell>City</TableCell>}
                  {!isTabletOrMobile && <TableCell>Timezone</TableCell>}
                  {/* {!isTabletOrMobile && (
                    <TableCell>Feature</TableCell>
                  )} */}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedeventList.map((item) => {
                  return (
                    <TableRow
                      key={item._id}
                      sx={{ '&:last-child td': { border: 0 } }}
                    >
                      <TableCell>{item.name}</TableCell>
                      {!isTabletOrMobile && (
                        <TableCell>
                          {moment(item.created_date).format('MM/DD/YYYY')}
                        </TableCell>
                      )}
                      {!isTabletOrMobile && (
                        <TableCell>
                          {moment(item.created_date).format('MM/DD/YYYY')}
                        </TableCell>
                      )}
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.subCat}</TableCell>
                      {!isTabletOrMobile && <TableCell>{item.state}</TableCell>}
                      {!isTabletOrMobile && (
                        <TableCell>{item.country}</TableCell>
                      )}
                      {!isTabletOrMobile && <TableCell>{item.city}</TableCell>}
                      {!isTabletOrMobile && (
                        <TableCell>{item.timeZone}</TableCell>
                      )}
                      {/* <TableCell>
                    <Checkbox
                      checked={item.isReservation}
                      color="primary"
                      onChange={(e) => handleChangeReservationStatus(e, item)}
                    />
                   </TableCell> */}
                      <TableCell>
                        <img
                          src={
                            '/static/images/rate/' +
                            (item.rating > 1 ? Math.ceil(item.rating) : 1) +
                            '.png'
                          }
                          style={{ width: '2rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 0 }}>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            openLangDlg(item._id);
                          }}
                          sx={{}}
                        >
                          <RecordIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        <Dialog
          fullWidth
          sx={{ maxWidth: 500, margin: 'auto' }}
          open={isShowLangDlg}
          keepMounted
        >
          <DialogTitle style={{ textAlign: 'center' }}>
            Select Language
          </DialogTitle>
          <DialogContent>
            <Select
              native
              fullWidth
              sx={{ maxWidth: 300 }}
              value={selectedLang}
              onChange={(event) => {
                setLanguage(event.target.value);
              }}
              input={<Input id="demo-dialog-native" />}
            >
              {langList.map((lang) => (
                <option key={lang._id} value={lang.language}>
                  {lang.language}
                </option>
              ))}
            </Select>
            {/* <Box mt={3} sx = {{display: 'flex', flexDirection: 'row'}}>
              <Typography component="legend">Your Rating</Typography>
              <Rating
                sx = {{marginLeft: 10}}
                name="simple-controlled"
                value={rating}
                readOnly 
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowLangDlg(false);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={closeLangDlgAndStart} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default BroadCasterHome;
