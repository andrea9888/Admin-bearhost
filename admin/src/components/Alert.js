import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleAlerts(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.success===1?<Alert severity="success">Uspješan zahtjev!</Alert>:<Alert severity="error">Došlo je do greške.</Alert>}

    </div>
  );
}
