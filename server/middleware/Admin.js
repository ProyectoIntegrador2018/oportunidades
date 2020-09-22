const KEY = process.env.JWT_KEY;
const jwt = require("jsonwebtoken");

/**
 * Check if user token belongs to an admin
 * @param {Object} req Request of post
 * @param {Object} res Response of post
 * @param {Object} next Calls next route
 */

function auth(req, res, next) {
   try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, KEY);
      User.findOne({ _id: decoded._id, "tokens.token": token })
         .then(function (user) {
            if (!user) {
               throw new Error();
            }
            if (!decoded.isAdmin)
               return res
                  .status(401)
                  .send({ error: "Not an admin" });
            req.token = token;
            req.admin = user;
            next();
         })
         .catch(function (error) {
            return res.status(401).send({ error: "Authentication required" });
         });
   } catch (error) {
      res.status(401).send({ error: "Invalid token" });
   }
}

module.exports = auth;
