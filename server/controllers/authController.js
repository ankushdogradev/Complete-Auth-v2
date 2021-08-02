const User = require("../models/userModels");
const ErrorResponse = require("../error/errorResponse");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

// SendGrid
const sgMail = require("@sendgrid/mail");
const { findOne } = require("../models/userModels");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//  @description: Signup
//  @route: POST /api/signup
//  @access: Public
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new ErrorResponse("User already exists", 400));
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    const { _id } = user;
    const activationToken = jwt.sign(
      { _id },
      process.env.JWT_ACTIVATION_SECRET,
      {
        expiresIn: process.env.JWT_ACTIVATION_EXPIRE,
      }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/account-activation/${activationToken}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>`,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Verification Email has been sent to ${email}.`,
        });
        return;
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

//  @description: Account Activation
//  @route: POST /api/account-activation
//  @access: Public
exports.accountActivation = async (req, res, next) => {
  const token = req.params.activationToken;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACTIVATION_SECRET,
      async (err, decoded) => {
        if (err) {
          return next(new ErrorResponse(`Link Expired try again`, 401));
        }
        const { _id } = jwt.decode(token);
        try {
          const user = await User.findOne({ _id });
          user.isVerify = true;
          await user.save();
          res.status(201).json({ user });
        } catch (error) {
          next(error);
        }
      }
    );
  } else {
    return next(
      new ErrorResponse("Token not found!!,Please generate new link", 404)
    );
  }
};

//  @description: Signin
//  @route: POST /api/signin
//  @access: Public
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please enter credentials properly", 400));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email not registered", 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Password", 401));
    }
    const { _id, name, isAdmin, isVerify } = user;

    console.log("isVerify: ", isVerify);
    if (!isVerify) {
      const activationToken = jwt.sign(
        { _id },
        process.env.JWT_ACTIVATION_SECRET,
        {
          expiresIn: process.env.JWT_ACTIVATION_EXPIRE,
        }
      );
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
                 <h1>Please use the following link to activate your account</h1>
                 <p>${process.env.CLIENT_URL}/auth/account-activation/${activationToken}</p>
                 <hr />
                 <p>This email may contain sensetive information</p>
                 <p>${process.env.CLIENT_URL}</p>`,
      };

      sgMail
        .send(emailData)
        .then((sent) => {
          return res.json({
            message: `Verification Email has been sent to ${email}.`,
            user: { _id, name, email, isAdmin, isVerify },
          });
          return;
        })
        .catch((error) => {
          next(error);
        });
    } else {
      const token = user.getSignedJwtToken();
      res.status(200).json({
        success: true,
        token,
        user: { _id, name, email, isAdmin, isVerify },
      });
    }
  } catch (error) {
    console.log("%% ", error);
    next(error);
  }
};

//  @description: Forgot Password
//  @route: PUT /api/forgot-password
//  @access: Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorResponse("Email dosen't exist, Kindly create new account", 401)
      );
    }

    const resetToken = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD_SECRET,
      {
        expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRE,
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${process.env.CLIENT_URL}/password-reset/${resetToken}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>${process.env.CLIENT_URL}</p>
      `,
    };
    return user.updateOne(
      { resetPasswordToken: resetToken },
      (err, success) => {
        if (err) {
          console.log("RESET PASSWORD LINK ERROR", err);
          new ErrorResponse(
            "Database connection error on user password forgot request",
            400
          );
        } else {
          sgMail
            .send(emailData)
            .then((sent) => {
              return res.json({
                message: `Reset Password Email has been sent to ${email}.`,
              });
            })
            .catch((error) => {
              user.resetPasswordToken = undefined;
              user.save();
              return next(new ErrorResponse("Email could not be sent", 500));
            });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

//  @description: Reset Password
//  @route: PUT /api/reset-password
//  @access: Public
exports.resetPassword = async (req, res, next) => {
  const { resetPasswordToken } = req.body;
  console.log("Reset Token Server >>> ", resetPasswordToken);
  try {
    if (resetPasswordToken) {
      jwt.verify(
        resetPasswordToken,
        process.env.JWT_RESET_PASSWORD_SECRET,
        async (err, decoded) => {
          if (err) {
            return next(new ErrorResponse("Expired link. Try again", 400));
          }
          const user = await User.findOne({ resetPasswordToken });

          if (!user) {
            return next(new ErrorResponse("Invalid reset token", 400));
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;

          await user.save();
          res.status(201).json({
            success: true,
            data: "Password Reset Success",
          });
        }
      );
    } else if (!resetPasswordToken) {
      return next(new ErrorResponse("Undefined!, try again", 404));
    }
  } catch (error) {
    next(error);
  }
};

// GOOGLE Signin
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//  @description: Google Auth
//  @route: POST /api/google-login
//  @access: Public
exports.googleLogin = async (req, res, next) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      console.log("Google Login: ", response);
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, isAdmin, isVerified } = user;
            return res.json({
              token,
              user: { _id, email, name, isAdmin, isVerified },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            let isVerify = true;
            user = new User({ name, email, password, isVerify });
            user.save((err, data) => {
              if (err) {
                console.log("Error Google logging on user Save", err);
                return next(
                  new ErrorResponse("Error: Signup failed with google", 400)
                );
              }

              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, isAdmin, isVerified } = data;
              return res.json({
                token,
                user: { _id, email, name, isAdmin, isVerified },
              });
            });
          }
        });
      } else {
        return next(new ErrorResponse("Google login failed. Try again", 400));
      }
    });
};

//  @description: Facebook Auth
//  @route: POST /api/facebook-login
//  @access: Public
exports.facebookLogin = async (req, res, next) => {
  console.log("Facebook Login Req body", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          const { _id, email, name, isAdmin, isVerified } = user;
          return res.json({
            token,
            user: { _id, email, name, isAdmin, isVerified },
          });
        } else {
          let password = email + process.env.JWT_SECRET;
          let isVerify = true;
          user = new User({ name, email, password, isVerify });
          user.save((err, data) => {
            if (err) {
              console.log("Error Facebook logging on user Save", err);
              return next(
                new ErrorResponse("Error: Signup failed with Facebook", 400)
              );
            }

            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, isAdmin, isVerified } = data;
            return res.json({
              token,
              user: { _id, email, name, isAdmin, isVerified },
            });
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        error: "Facebook login failed, try again",
      });
    });
};
