import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(404)
        .json({ message: 'Token not found! Unauthorised!' });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res
        .status(404)
        .json({ message: 'Token not verified! Unauthorised!' });
    }
    // console.log('decodeToken', decodeToken);
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'isAuth not found!' });
  }
};
export default isAuth;
