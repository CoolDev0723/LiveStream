import { textAlign } from "@material-ui/system";

export const styles = {
  pc:{
    viewBg: {
      width: '100%',
      height: '100%',
      backgroundImage:"url(/static/images/home/background1.png)",
      backgroundSize: '100% 100%',
      lineHeight:'normal'
    },
    viewLogo: {
      width: '100%',
      textAlign: 'center',
    },
    viewMic: {
      width: '100%',
      height:"calc(100% - 260px)"
      // backgroundImage:"url(/static/images/home/mic.png)",
      // backgroundRepeat: 'no-repeat',
      // backgroundPosition: 'center 1rem',
    },
    viewContent: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      position: 'absolute',
    },
    topMenuTxt: {
      fontSize: 30,
      color: 'white',
      display: 'inline',
      marginLeft: 30,
      marginRight: 30,
    },
    viewSubLeftContent: {
      width: '60%',
      marginLeft: '30%',
      marginRight: '10%',
      backgroundImage: 'url(static/images/home/content_bg.png)',
      backgroundPosition: 'center top',
      height: '100%',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    },
    viewSubRightContent: {
      width: '60%',
      marginLeft: '10%',
      marginRight: '30%',
      backgroundImage: 'url(static/images/home/content_bg.png)',
      backgroundPosition: 'center top',
      height: '100%',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    },
    txtSubTitle: {
      fontSize: '25px',
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: '20%',
      width: '60%',
      marginLeft: '19%',
      marginRight: '21%',
    },
    txtSubDesc: {
      fontSize: '15px',
      color: 'black',
      fontWeight: 'normal',
      textAlign: 'center',
      width: '60%',
      marginLeft: '19%',
      marginRight: '21%',
    },
    blackBox: {
      width:'64%',
      marginLeft: '17%',
      marginRight: '19%',
      backgroundColor:'black',
      display:'flex',
      height:'100px',
      marginTop:'30px',
    },
    buttonDesc:{
      width: '55%',
      textAlign:'center',
      color:'white',
      display:'flex',
      textAlign:'center',
      alignItems: 'center',
    },
    buttonGoogleDescTxt:{
      width: '85%',
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign:'center',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    buttonDescTxt:{
      width: '90%',
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign:'center',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    footer: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    }
  }
};
