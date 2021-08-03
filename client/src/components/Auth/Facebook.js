import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = async (res) => {
    try {
      const { data } = await axios.post(
        "https://complete-auth-v2.herokuapp.com/api/facebook-login",
        {
          userID: res.userID,
          accessToken: res.accessToken,
        }
      );
      informParent(data);
    } catch (error) {
      console.log("Facebook signin error: ", error);
    }
  };

  return (
    <>
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <FaFacebook
            onClick={renderProps.onClick}
            className="social facebook"
          />
        )}
      />
    </>
  );
};

export default Facebook;
