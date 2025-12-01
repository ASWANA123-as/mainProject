export const checkRole = (role) => (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.usertype !== role) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
