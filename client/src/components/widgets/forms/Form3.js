import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';

const Form3 = () => (
  <Box
    sx={{
      backgroundColor: 'background.paper',
      minHeight: '100%',
      p: 3
    }}
  >
    <form onSubmit={(event) => event.preventDefault()}>
      <CardHeader title="Notifications" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
        >
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Typography
              color="textPrimary"
              gutterBottom
              variant="subtitle2"
            >
              System
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              You will receive emails in your business email address
            </Typography>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    defaultChecked
                  />
                )}
                label="Email alerts"
              />
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Push Notifications"
              />
            </div>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    defaultChecked
                  />
                )}
                label="Text message"
              />
            </div>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    defaultChecked
                  />
                )}
                label={(
                  <>
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                      Phone calls
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                    >
                      Short voice phone updating you
                    </Typography>
                  </>
                )}
              />
            </div>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Typography
              color="textPrimary"
              gutterBottom
              variant="subtitle2"
            >
              Chat App
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              You will receive emails in your business email address
            </Typography>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    defaultChecked
                  />
                )}
                label="Email"
              />
            </div>
            <div>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    defaultChecked
                  />
                )}
                label="Push notifications"
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          type="submit"
          variant="contained"
        >
          Save Settings
        </Button>
      </CardActions>
    </form>
  </Box>
);

export default Form3;
