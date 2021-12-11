import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';

const Modal7 = () => (
  <Box
    sx={{
      backgroundColor: 'background.default',
      minHeight: '100%',
      p: 3
    }}
  >
    <Paper
      elevation={12}
      sx={{
        maxWidth: 320,
        mx: 'auto',
        p: 2
      }}
    >
      <Typography
        color="textPrimary"
        variant="h6"
      >
        Settings
      </Typography>
      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Theme"
          select
          SelectProps={{ native: true }}
          variant="outlined"
        >
          {['Light', 'Dark', 'Nature'].map((theme) => (
            <option
              key={theme}
              value={theme}
            >
              {theme}
            </option>
          ))}
        </TextField>
      </Box>
      <Box
        sx={{
          mt: 2,
          px: 1.5
        }}
      >
        <FormControlLabel
          control={(
            <Switch
              color="primary"
              edge="start"
            />
          )}
          label="RTL"
        />
      </Box>
      <Box
        sx={{
          mt: 2,
          px: 1.5
        }}
      >
        <FormControlLabel
          control={(
            <Switch
              color="primary"
              edge="start"
            />
          )}
          label="Responsive font sizes"
        />
      </Box>
      <Box
        sx={{
          mt: 2,
          px: 1.5
        }}
      >
        <FormControlLabel
          control={(
            <Switch
              color="primary"
              edge="start"
            />
          )}
          label="Compact"
        />
      </Box>
      <Box
        sx={{
          mt: 2,
          px: 1.5
        }}
      >
        <FormControlLabel
          control={(
            <Switch
              color="primary"
              edge="start"
            />
          )}
          label="Rounded Corners"
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
        >
          Save Settings
        </Button>
      </Box>
    </Paper>
  </Box>
);

export default Modal7;
