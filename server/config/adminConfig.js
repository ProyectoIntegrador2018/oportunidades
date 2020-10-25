const User = require("../models/User");
const userController = require("../controllers/UserController");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME;

User.findByEmail(adminEmail).then((admin) => {
   if (!admin) {
      let admin = {};
      admin.name = adminName;
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.isAdmin = true;
      admin.userType = "admin";
      userController.createUser(admin).then(user => {
         console.log("Successfully created admin user.");
      }).catch(err => {
         console.log(err);
      })
   }
});
