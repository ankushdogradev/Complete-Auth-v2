const User = require("../models/userModels");
const ErrorResponse = require("../error/errorResponse");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
    const userExist = await User.findOne({ email });

    if (userExist) {
      return next(new ErrorResponse("Email already exist, kindly signin", 400));
    }

    const activationToken = jwt.sign(
      { name, email, password },
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
                <p>${process.env.CLIENT_URL}/auth/activate/${activationToken}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>`,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
        });
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
exports.accountActivation = (req, res, next) => {
  const { activationToken } = req.body;
  try {
    if (activationToken) {
      jwt.verify(
        activationToken,
        process.env.JWT_ACTIVATION_SECRET,
        function (err, decoded) {
          if (err) {
            return next(new ErrorResponse(`Expired Link. Signup again`, 401));
          }
          const { name, email, password } = jwt.decode(activationToken);

          const user = new User({ name, email, password });
          user.save((err, user) => {
            if (err) {
              return next(
                new ErrorResponse(
                  `Error saving user in database. Try signup again`,
                  401
                )
              );
            }
            return res.json({
              message: "Signup success. Please signin.",
            });
          });
        }
      );
    }
  } catch (error) {
    next(error);
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

    const token = user.getSignedJwtToken();
    const { _id, name, isAdmin } = user;
    res
      .status(200)
      .json({ success: true, token, user: { _id, name, email, isAdmin } });
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
          <p>${process.env.CLIENT_URL}/auth/password/reset/${resetToken}</p>
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
                message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
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
    console.log("** ", error);
    next(error);
  }
};
