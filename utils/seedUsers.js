const seeder = require("mongoose-seed");
const User = require("../models/user");

const superuser = new User({
  username: "superuser",
  isAdmin: true
});
superuser.setPassword("password");

const user01 = new User({
  username: "user01",
  isAdmin: false
});
user01.setPassword("password01");

const user02 = new User({
  username: "user02",
  isAdmin: false
});
user02.setPassword("password02");

const user03 = new User({
  username: "user03",
  isAdmin: false
});
user03.setPassword("password03");

const user04 = new User({
  username: "user04",
  isAdmin: false
});
user04.setPassword("password04");

const user05 = new User({
  username: "user05",
  isAdmin: false
});
user05.setPassword("password05");

const user06 = new User({
  username: "user06",
  isAdmin: false
});
user06.setPassword("password06");

const user07 = new User({
  username: "user07",
  isAdmin: false
});
user07.setPassword("password07");

const user08 = new User({
  username: "user08",
  isAdmin: false
});
user08.setPassword("password08");

const user09 = new User({
  username: "user09",
  isAdmin: false
});
user09.setPassword("password09");

const user10 = new User({
  username: "user10",
  isAdmin: false
});
user10.setPassword("password10");

const data = [
  {
    model: "User",
    documents: [
      { ...superuser.toJSON() },
      { ...user01.toJSON() },
      { ...user02.toJSON() },
      { ...user03.toJSON() },
      { ...user04.toJSON() },
      { ...user05.toJSON() },
      { ...user06.toJSON() },
      { ...user07.toJSON() },
      { ...user08.toJSON() },
      { ...user09.toJSON() },
      { ...user10.toJSON() }
    ]
  }
];

// Connect to MongoDB via Mongoose
seeder.connect(
  process.env.MONGODB_URI || "mongodb://localhost/jumpstart",
  () => {
    console.log("SEEDED");
    seeder.loadModels(["models/user.js"]);
    seeder.clearModels(["User"], () => {
      seeder.populateModels(data, () => {
        // seeder.disconnect();
      });
    });
  }
);
