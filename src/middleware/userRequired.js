export const userRequired = (req, res, next) => {
  const user = res.locals.user;
  if (!user) return res.status(403);
  return next();
};
