import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";
import Storage from "@aws-amplify/storage";
import uuidv4 from 'uuid/v4';


class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  }
  uploadImage = () => {
    Storage.configure({
      bucket: process.env.REACT_APP_AWS_S3_BUCKET,
      level: process.env.REACT_APP_AWS_UPLOAD_FOLDER,
      region: process.env.REACT_APP_AWS_REGION,
      identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID
    });

    let n = this.upload.files[0].name.lastIndexOf(".");
    let ext = this.upload.files[0].name.substring(n);
    let file_name = uuidv4() + ext;
    Storage.put(`${file_name}`,
      this.upload.files[0],
      { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        this.setState({ uplad_image: `https://s3.amazonaws.com/${process.env.REACT_APP_AWS_S3_BUCKET}/public/${file_name}` });
        this.setState({ response: "Success uploading file!" });
      })
      .catch(err => {
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    const { username, email, password } = this.state;
    try {
      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email,
          phone_number: '+12135555555',
          name: 'mu name',
          zoneinfo: "US",
          'custom:instagramId': '12345'
        }
      });
      this.props.history.push("/welcome");
      console.log(signUpResponse);
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Register</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="userNameHelp"
                  placeholder="Enter username"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="email"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm password"
                  value={this.state.confirmpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Register
                </button>
              </p>
            </div>
          </form>

          <h2>S3 Upload example...</h2>
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            ref={ref => (this.upload = ref)}
            onChange={e =>
              this.setState({
                imageFile: this.upload.files[0],
                imageName: this.upload.files[0].name
              })
            }
          />
          <input value={this.state.imageName} placeholder="Select file" />
          <button
            onClick={e => {
              this.upload.value = null;
              this.upload.click();
            }}
            loading={this.state.uploading}
          >
            Browse
        </button>

          <button onClick={this.uploadImage}> Upload File </button>
          {!!this.state.response && <div>{this.state.response}</div>}
          <br />
          <img src={this.state.uplad_image} />
        </div>
      </section>
    );
  }
}

export default Register;