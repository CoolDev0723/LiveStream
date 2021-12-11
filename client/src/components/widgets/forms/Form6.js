import { useState } from 'react';
import MobileDateTimePicker from '@material-ui/lab/MobileDateTimePicker';
import { Box, Button, Divider, FormControlLabel, Switch, TextField } from '@material-ui/core';

const Form6 = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3
      }}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          variant="outlined"
        />
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={(
              <Switch
                color="primary"
                name="allDay"
              />
            )}
            label="All day"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MobileDateTimePicker
            onChange={(newDate) => setStartDate(newDate)}
            label="Start date"
            renderInput={(inputProps) => (
              <TextField
                fullWidth
                variant="outlined"
                {...inputProps}
              />
            )}
            value={startDate}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MobileDateTimePicker
            onChange={(newDate) => setEndDate(newDate)}
            label="End date"
            renderInput={(inputProps) => (
              <TextField
                fullWidth
                variant="outlined"
                {...inputProps}
              />
            )}
            value={endDate}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            sx={{ ml: 1 }}
            type="submit"
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form6;
