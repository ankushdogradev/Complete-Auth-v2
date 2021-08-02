import React from "react";
import GoogleLogin from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Google = ({ informParent = (f) => f }) => {
  const onSuccess = async (res) => {
    console.log("[Google Login Success] tokenId: ", res.tokenId);
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/google-login",
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
        clientId="386485948244-vd2r3ndi04fcerhej5q334f5ujjmngv3.apps.googleusercontent.com"
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
