const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneObjectId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneObjectId,
  name: "TestUser",
  email: "test@user.com",
  password: "TestUser1!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneObjectId }, process.env.JWT_SECRET_TOKEN),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should sign in a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Mehul",
      email: "007.mehulkhimavat@gmail.com",
      password: "NewPassIt123!",
    })
    .expect(201);

    
//Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    
    expect(user).not.toBeNull()

//Assertions about the response
    expect(response.body).toMatchObject({
      user : {
        name : 'Mehul',
        email : '007.mehulkhimavat@gmail.com'
      },
      token : user.tokens[0].token
    })
    expect(user.password).not.toBe('NewPassIt123!')
});


test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
    
    //Assert that the new generated token matches
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "rohit@email.com",
      password: "rohitPass1!",
    })
    .expect(400);
});

test("SHould get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthorized user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete account for unauthorized user", async ()=>{
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async()=>{
  await request(app)
        .post()
})