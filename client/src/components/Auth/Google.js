import React from "react";
import GoogleLogin from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Google = ({ informParent = (f) => f }) => {
  const onSuccess = async (res) => {
    try {
      const { data } = await axios.post(
        "https://complete-auth-v2.herokuapp.com/api/google-login",
        {
          idToken: res.tokenId,
        }
      );
      informParent(data);
    } catch (error) {
      console.log("Google signin error: ", error);
    }
  };

  const onFaliure = (res) => {
    console.log("[Google Login Failed] res: ", res);
  };

  return (
    <>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        render={(renderProps) => (
          <FcGoogle
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="social"
          />
        )}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFaliure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
};

export default Google;
