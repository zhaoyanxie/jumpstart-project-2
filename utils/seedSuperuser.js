const seeder = require("mongoose-seed");

const data = [
  {
    model: "User",
    documents: [
      {
        username: "superuser",
        password: "password",
        isAdmin: true
      }
    ]
  }
];

const seedSuperUser = () => {
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
};

module.exports = seedSuperUser;
