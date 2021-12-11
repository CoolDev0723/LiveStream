import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ArchiveIcon from '../../../icons/Archive';
import DocumentTextIcon from '../../../icons/DocumentText';
import DotsHorizontalIcon from '../../../icons/DotsHorizontal';
import DownloadIcon from '../../../icons/Download';
import PencilAltIcon from '../../../icons/PencilAlt';
import TrashIcon from '../../../icons/Trash';
import bytesToSize from '../../../utils/bytesToSize';

const files = [
  {
    id: '5e8dd0721b9e0fab56d7238b',
    mimeType: 'image/png',
    name: 'example-project1.jpg',
    size: 1024 * 1024 * 3,
    url: '/static/mock-images/projects/project_4.png'
  },
  {
    id: '5e8dd0784431995a30eb2586',
    mimeType: 'application/zip',
    name: 'docs.zip',
    size: 1024 * 1024 * 25,
    url: '#'
  },
  {
    id: '5e8dd07cbb62749296ecee1c',
    mimeType: 'image/png',
    name: 'example-project2.jpg',
    size: 1024 * 1024 * 2,
    url: '/static/mock-images/projects/project_1.png'
  }
];

const GridList3 = () => {
  const moreRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
        p: 3
      }}
    >
      <Grid
        container
        spacing={3}
      >
        {files.map((file) => (
          <Grid
            item
            key={file.id}
            md={4}
            xs={12}
          >
            <Card>
              {file.mimeType.includes('image/')
                ? (
                  <CardMedia
                    image={file.url}
                    sx={{ height: 140 }}
                  />
                )
                : (
                  <Box
                    sx={{
                      alignItems: 'center',
                      backgroundColor: blueGrey['50'],
                      color: '#000000',
                      display: 'flex',
                      height: 140,
                      justifyContent: 'center'
                    }}
                  >
                    <DocumentTextIcon fontSize="large" />
                  </Box>
                )}
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="caption"
                  >
                    {bytesToSize(file.size)}
                  </Typography>
                </div>
                <div>
                  <Tooltip title="More options">
                    <IconButton
                      edge="end"
                      onClick={handleMenuOpen}
                      ref={moreRef}
                      size="small"
                    >
                      <DotsHorizontalIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  fullWidth
                  startIcon={<DownloadIcon fontSize="small" />}
                  variant="text"
                >
                  Download
                </Button>
              </CardActions>
              <Menu
                anchorEl={moreRef.current}
                anchorOrigin={{
                  horizontal: 'left',
                  vertical: 'top'
                }}
                elevation={1}
                onClose={handleMenuClose}
                open={openMenu}
                PaperProps={{
                  sx: {
                    maxWidth: '100%',
                    width: 250
                  }
                }}
                transformOrigin={{
                  horizontal: 'left',
                  vertical: 'top'
                }}
              >
                <MenuItem divider>
                  <ListItemIcon>
                    <PencilAltIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem divider>
                  <ListItemIcon>
                    <TrashIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ArchiveIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Archive" />
                </MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GridList3;
