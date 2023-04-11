import jwt from "jsonwebtoken";

/**
 * Middleware to verify if user is logedin with a valid auth2 token.
 * @param {*} req the request
 * @param {*} res the response
 * @param {*} next
 * @returns error message if no token or invalid.
 */
export const authorize = (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) {
    return res.status(401).send({ error: "Access denied!" });
  }
  try {
    const authorized = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.user = authorized;
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Invalid token!", error: err.message });
  }
};

/**
 * Middleware to sign an oauth2 token for a succefully loggedin user.
 * @param {Object} user the loggedin user
 * @returns the oauth2 token.
 */
export const generateAuthToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, organisation: user.organisation._id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

/**
 * Middleware to expire a token.
 * @param {jwt} token the token to detroy
 * @return error or success message.
 */
export const destroyToken = (token) => {
  const message = jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      return { message: "You have been successfully logged out!" };
    } else {
      return { error: "Error logging out!" };
    }
  });
  return message;
};
