import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = async (res) => {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/facebook-login",
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
        appId="342071177390094"
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
