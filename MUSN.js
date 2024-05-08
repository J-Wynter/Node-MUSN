import express, { request, response } from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import expressSession from 'express-session';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'; // Ensure this is at the top to load environment variables early
const app = express();
const port = 3002;
app.use(express.json());
app.use(fileUpload());
app.use(
  expressSession({
    secret: 'lsdfkjsdlf',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: true
  })
);

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

//Use client to create database and collection
const database = client.db("MUSN");
const usersCollection = database.collection("users");
const postsCollection = database.collection("user_posts")

//User Registration
app.post('/M00874694/create', async (request, response) => {

  let newUser = request.body
  usersCollection.insertOne(newUser);
  console.log('new user added to DB')
  newUser.following = [];

  response.send({ phone: request.session.phone, Username: request.session.username })
});

// add friend 
app.post('/M00874694/friend', async (request, response) => {
  let friendRequest = request.body;
  console.log(friendRequest);

  if (request.session.phone === undefined) {
    return response.send({ login: false, message: "Login to add friend"});
  }

  // Validate the friend's phone number to ensure it's not null or undefined
  const friendPhone = friendRequest.Phone;
  if (!friendPhone) {
    console.log(friendPhone);
    return response.send({ success: false, message: "Invalid phone number"});
  }

  try {
    const result = await usersCollection.updateOne(
      { Phone: request.session.phone }, // Filter by the session phone number
      { $addToSet: { following: friendPhone } } // Add friend's phone to 'following' array
    );

    if (result.modifiedCount === 0) {
      console.log("No update was made. The user might not have been found.");
      return response.send({ follow: false, message: "No changes made. User not found." });
    }

    console.log("Successfully added friend.");
    response.send({ follow: true, message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    response.status(500).send({ error: true, message: "An error occurred" });
  }
});

//Friend list
app.get('/M00874694/friend', async (request, response) => {
  if (request.session.phone === undefined) {
      return response.send({ login: false, message: "Please log in to view your friends list." });
  }
  try {
      const userPhone = request.session.phone;
      const userDocument = await usersCollection.findOne({ Phone: userPhone });

      if (!userDocument) {
          return response.send({ success: false, message: "User not found." });
      }

      const followingList = userDocument.following; // This is an array of phone numbers

      if (!followingList || followingList.length === 0) {
          return response.send({ success: true, following: [], message: "You are not following anyone yet." });
      }

      // Initialize an array to hold the usernames of the followed users
      let followedUsernames = [];

      // Fetch each followed user's document to get their username
      for (let phone of followingList) {
          const followedUser = await usersCollection.findOne({ Phone: phone });
          if (followedUser) {
              // Add the followed user's username to the array
              followedUsernames.push(followedUser.Username); // Assuming the field is called 'Username'
          } else {
              // Optionally handle the case where a followed user's document is not found
              followedUsernames.push(`User with phone ${phone} not found.`);
          }
      }

      return response.send({ success: true, following: followedUsernames });
    } catch (error) {
      console.error("Error retrieving friends list:", error);
      response.status(500).send({ error: true, message: "An error occurred while fetching your friends list." });
  }
});

//search user
app.post('/M00874694/searchUsers', async (request, response) => {

  const searchQuery = request.body.searchQuery;

  if (!searchQuery) {
    return response.status(400).json({ error: 'Search query is required' });
  } 
  try {
    // Perform a search in the usersCollection. This example assumes names can be partially matched.
    const results = await usersCollection.find({
      $or: [
        { Username: { $regex: searchQuery, $options: 'i' } },
        { Phone: { $regex: searchQuery, $options: 'i' } }
      ]
    }).toArray();
    response.json(results.map(user => ({
      username: user.Username,
      phone: user.Phone
    })));
  } catch (error) {
    console.error("Error searching users:", error);
    response.status(500).json({ error: 'An error occurred during the search' });
  }
});

//login status
app.get('/M00874694/login', (request, response) => {
  if (request.session.phone === undefined) {
    response.send({ login: false });
  }
  else {
    response.send({ login: true, phone: request.session.phone, Username: request.session.username });
  }
});

// Login function
app.post('/M00874694/login', async (request, response) => {
  const user = request.body;

  //Check that name and password exist
  if (!user.Phone || !user.Password) {
    return response.status(400).json({ error: 'Phone and Password are required' });
  }

  //Run query on database to see if username and password exist

  let query = { $and: [{ Phone: user.Phone }, { Password: user.Password }] };
  const results = await usersCollection.find(query).toArray();
  if (results.length === 1) {
    console.log("success login");
    //Store phone in requst.session
    request.session.phone = user.Phone;
    request.session.username = results[0].Username;
    response.send({ "login": "successful." });
  } else {
    console.log("login failed")
    response.send({ "login": "Failed." })
  };
});

app.delete('/M00874694/login', (request, response) => {
  //Destroy session.
  request.session.destroy(err => {
    if (err)
      response.send('{"error": ' + JSON.stringify(err) + '}');
    else
      response.send('{"logged": "Out"}');
  });
})

app.post('/M00874694/upload', function (request, response) {
  //Check to see if a file has been submitted on this path
  if (!request.files || Object.keys(request.files).length === 0) {
    return response.status(400).send('{"upload": false, "error": "Files missing"}');
  }

  // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
  let myFile = request.files.myFile;

  //CHECK THAT IT IS AN IMAGE FILE, NOT AN .EXE ETC.

  //unique file name
  let uniqueFile = uuidv4();

  if (request.session.phone === undefined) {
    response.send({ login: false });
  }
  else {

    uniqueFile += myFile.name.substring(myFile.name.indexOf('.'), myFile.name.length);
    console.log("uploading: " + uniqueFile);

    /* Use the mv() method to place the file in the folder called 'uploads' on the server.
        This is in the current directory */
    myFile.mv('./public/uploads/' + uniqueFile, (err) => {
      if (err)
        return response.status(500).send('{"filename": "' +
          uniqueFile + '", "upload": false, "error": "' +
          JSON.stringify(err) + '"}');

      //Send back confirmation of the upload to the client.
      response.send('{"filename": "' + uniqueFile +
        '", "upload": true}');
    });
  }
});


app.post('/M00874694/post', async (request, response) => {

  const newPost = request.body;

  //See if user is logged in 
  if (request.session.phone === undefined) {
    response.send({ login: false, message: "login to send a post" });
  }
  if (newPost.title === undefined || newPost.text === undefined) {
    response.send({ error: true, message: "Fill in all fields" });
    return;
  }
  else {
    newPost.phone = request.session.phone;
    const result = await postsCollection.insertOne(newPost);
    console.log('add post to DB')
    console.log(result);

    response.send({ "Post": "data receieved." })
  }
});

app.get('/M00874694/followingPosts', async (request, response) => {
  if (request.session.phone === undefined) {
    return response.status(401).json({ error: 'User not logged in' });
  }
  try {
    // Fetch the current user's document to get their following list
    const currentUser = await usersCollection.findOne({ Phone: request.session.phone });
    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Assuming the 'following' field is an array of userIds the current user is following
    const followingList = currentUser.following;

    // Fetch posts made by users in the following list
    const posts = await postsCollection.find({
      phone: { $in: followingList }
    }).toArray();

    response.json(posts);
  } catch (error) {
    console.error("Error fetching following users' posts:", error);
    response.status(500).json({ error: 'An error occurred' });
  }
});

app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});