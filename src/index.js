import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import './index.css';
import App from './App';
import Amplify from "aws-amplify";
import * as serviceWorker from './serviceWorker';
Amplify.configure({
  Auth: {
    //mandatorySignIn: true,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_APP_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID
  },
  Storage: {
    bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    level: process.env.REACT_APP_AWS_UPLOAD_FOLDER,
    region: process.env.REACT_APP_AWS_REGION,
    identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID
  }

});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
