const seeder = require("mongoose-seed");
const User = require("../models/user");

const superuser = new User({
  username: "superuser",
  isAdmin: true
});
superuser.setPassword("password");

const data = [
  {
    model: "User",
    documents: [
      {
        username: superuser.username,
        isAdmin: superuser.isAdmin,
        salt: superuser.salt,
        hash: superuser.hash
      }
    ]
  }
];

// Connect to MongoDB via Mongoose
seeder.connect(
  process.env.MONGODB_URI || "mongodb://localhost/jumpstart",
  () => {
    // Load Mongoose models
    seeder.loadModels(["models/user.js"]);

    // Clear specified collections
    seeder.clearModels(["User"], () => {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, () => {
        console.log("***** superuser data seeded! *****");
        seeder.disconnect();
      });
    });
  }
);

module.exports = seedSuperUser;
