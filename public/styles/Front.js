// Get the modal
const modal = document.getElementById("myModal");
const loginModal = document.getElementById("loginModal");
const uploadModal = document.getElementById("uploadModal");
const apiBox1 = document.getElementById("apiBox1");
const apiBox2 = document.getElementById("apiBox2");
const createLink = document.getElementById("createLink");
const loginLink = document.getElementById("loginLink");
const uploadPost = document.getElementById("uploadPost");
const apiHeader1 = document.getElementById("apiHeader1");
const apiHeader2 = document.getElementById("apiHeader2");
const Feed = document.getElementById("Feed");
const upload = document.getElementById("upload");
const friends = document.getElementById("friends");
const createborder2 = document.getElementById("createborder2");
const loginStatus = document.getElementById("loginStatus");
const feedUser = document.getElementById("feedUser");
const postText = document.getElementById("postText").value;
const loggedInUser = document.getElementById('loggedInUser');
const searchModal = document.getElementById('searchModal')
const logoutSubmit = document.getElementById('logoutSubmit')

let HideLogOut = () => {
  logoutSubmit.style.display = 'none';
}
let showLogOut = () => {
  logoutSubmit.style.display = 'block';
}

//function to hide api
const noApi = () => {

  if (apiBox1 && apiBox2 && Feed && apiHeader1 && apiHeader2 && upload && friends) {
    apiBox1.style.display = "none";
    apiBox2.style.display = "none";
    Feed.style.display = "none";
    apiHeader1.style.display = "none";
    apiHeader2.style.display = "none";
    upload.style.display = "none";
    friends.style.display = "none";
  }
};
// function to show api
const showApi = () => {
  if (apiBox1 && apiBox2 && apiHeader1 && apiHeader2) {
    apiBox1.style.display = "inline-block";
    apiBox2.style.display = "inline-block";
    Feed.style.display = "inline-block";
    apiHeader1.style.display = "inline-block";
    apiHeader2.style.display = "inline-block";
    upload.style.display = "inline-block";
    friends.style.display = "inline-block";
  }
};

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
let loginClose = document.getElementsByClassName("loginClose")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  showApi()
}
//function to close login modal box 
loginClose.onclick = function () {
  loginModal.style.display = "none";
  showApi();
}
loginClose.onclick = function () {
  uploadModal.style.display = "none";
  showApi();
}

// Create account modal
createLink.addEventListener("click", function () {
  modal.style.display = "block";
  loginModal.style.display = "none";
  uploadModal.style.display = "none";
  noApi()
});

loginLink.addEventListener("click", function () {
  modal.style.display = "none";
  uploadModal.style.display = "none";
  loginModal.style.display = "block";
  noApi();
})

uploadPost.addEventListener("click", function () {
  modal.style.display = "none";
  loginModal.style.display = "none";
  uploadModal.style.display = "block";

  noApi();
})

//sticky api header
window.onscroll = function () { myFunction() };
window.onload = function () {checkLoginStatus()};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal || event.target == loginModal || event.target == uploadModal || event.target == searchModal) {
    modal.style.display = "none";
    loginModal.style.display = "none";
    uploadModal.style.display = "none";
    searchModal.style.display = "none";
    showApi();
  }
};

// function for storing the created accounts
async function store() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const createJSON = JSON.stringify({ Email: email, Username: username, Phone: phone, Password: password });
  try {
    const response = await fetch('/M00874694/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: createJSON
    });
    const result = await response.json();
    console.log(result);
  }

  catch (err) {
    console.log("error loading " + err);
  }

}

function validation() {
  validateUsernameInputs()
}

//validation
function validateUsernameInputs() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (username === "") {
    alert("Username is required");
    console.log("no username")
    return;
  } else if (username.length < 3 || username.length > 15) {
    alert("Username must be between 3 and 15 characters");
    console.log("not long neough")
    return;
  }

  if (phone === "") {
    alert("A Phone Number is Required");
    console.log("no number")
    return;
  }
  else if (phone.length < 11 || phone.length > 11) {
    alert("Number must be 11 digits");
    return;
  }

  if (email === "") {
    alert("Email is required");
    return;
  } else if (!email.includes("@") && !email.includes(".")) {
    alert("Enter a valid email address");
    return;
  } else if (email.includes("@") && email.includes(".")) {

    if (password === "") {
      alert("Please provide a password");
      console.log("no password")
      return;
    } else if (password.length < 2 || password.length > 15) {
      alert("Password must be between 2 and 15 characters");
      return;
    } else {
      store()
      alert("You have Successfully made an account");
      console.log("successful password")

    }
  };

}

//LOGIN CODE
async function check() {
  // entered data from the login-form
  const loginPassword = document.getElementById('loginPassword').value;
  const loginPhone = document.getElementById('loginPhone').value;
  const createJSON = JSON.stringify({ Phone: loginPhone, Password: loginPassword });
  try {
    const response = await fetch('/M00874694/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: createJSON
    });
    const result = await response.json();
    console.log(result);
    const resultString = JSON.stringify(result);
    checkLoginStatus();
    // Display the stringified result in your HTML
    loginStatus.innerHTML = `<p>${resultString}</p>`;
  }

  catch (err) {
    console.log("error loading " + err);
  }
}
if (loginPassword === "" ||
  loginPhone === "") {
  alert('complete all fieleds')
}

async function getFriends() {
  try {
    const response = await fetch('/M00874694/friend'); 
    if (response.ok) {
      const data = await response.json(); // Expecting an array of friend usernames
      const friendsList = document.getElementById('friendsList');
      // Clear existing list
      friendsList.innerHTML = '';
      
      // Assuming `data` is an array of usernames. Adjust as needed based on actual response structure.
      data.following.forEach(friendUsername => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#Post"; // Set to a relevant href for each friend. Adjust as needed.
        link.textContent = `@${friendUsername}`; // Prefixing with @ symbol, adjust as needed.
        listItem.appendChild(link);
        friendsList.appendChild(listItem);
      });
      fetchAndDisplayFollowingPosts();
      console.log(data);
    } else {
      console.error('Failed to fetch friends:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
}

// Login status
async function checkLoginStatus() {
  try {
    const response = await fetch('/M00874694/login'); 
    if (response.ok) {
      const data = await response.json();
      if (data.login) {
        const loggedInUsername = data.Username;
        const loggedInPhone = data.phone;
        const loggedInUser = document.getElementById('loggedInUser');
        loggedInUser.innerText = `Logged in as: ${loggedInUsername} (${loggedInPhone})`;
        getFriends();
        showLogOut();
        console.log(data);
      } else {
        HideLogOut();
        console.log('User is not logged in');
        loggedInUser.innerText = "Create an account or login";
        const friendsList = document.getElementById('friendsList');
        // Clear existing list
        friendsList.innerHTML = '';
      }
    } else {
      console.error('Failed to fetch login status:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching login status:', error);
  }
}

Login = () =>{
  check();
}
// Assuming addFriend is called with the phone number of the user to be added as a friend
async function addFriend(phone) {
  // Ensure there's a phone number to add
  if (!phone) {
      alert('Invalid phone number.');
      return;
  }
  try {
      // Send the friend request to the server
      const response = await fetch('/M00874694/friend', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // Include credentials if your session management relies on cookies
              'Credentials': 'include',
          },
          body: JSON.stringify({ Phone: phone })
      });

      const result = await response.json(); // Parse the JSON result from the server
      // Check the server's response
      if (result.follow === true) {
          alert('Friend added successfully.');
          // Optionally, refresh the friend list or update the UI accordingly
      } else {
          // Server responded with an error or the add operation failed
          alert(result.message || 'Failed to add friend.');
      }
  } catch (error) {
      // Handle errors in sending the request or receiving the response
      console.error("Error adding friend:", error);
      alert('An error occurred while trying to add a friend.');
  }
}

function openModal() {
  document.getElementById('searchModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('searchModal').style.display = 'none';
}

// Attach event listener to the close button
document.querySelector('.close-button').addEventListener('click', closeModal);

async function searchUsers() {
  const searchQuery = document.getElementById('userSearchQuery').value.trim();
  // Ensure the search query is not empty
  if (!searchQuery) {
      alert('Please enter a search query.');
      return;
  }
  try {
      const response = await fetch('/M00874694/searchUsers', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchQuery: searchQuery })
      });

      // Check if the response is OK and parse it as JSON
      if (response.ok) {
          const users = await response.json();
          // Get the search results container
          const resultsContainer = document.getElementById('searchResults');
          resultsContainer.innerHTML = ''; // Clear previous results
          // Iterate through the users and display each one
          users.forEach(user => {
              // Create a new div element for each user
              const userElement = document.createElement('div');
              userElement.classList.add('result-item');
              // Display the user's name and phone number
              userElement.innerHTML = `${user.username} (${user.phone}) `;
              if(user.username && user.phone === undefined){
              }
              // Create the "Add Friend" button
              const addButton = document.createElement('button');
              addButton.textContent = 'Add Friend';
              addButton.classList.add('follow-btn'); // Use the class for styling
              // Attach the event listener to the button
              addButton.addEventListener('click', () => addFriend(user.phone));
              // Append the button to the user element
              userElement.appendChild(addButton);
              // Append the user element to the results container
              resultsContainer.appendChild(userElement);
          });
      } else {
          // Handle HTTP error responses
          console.error('Failed to fetch search results:', response.statusText);
          alert('Failed to fetch search results. Please try again.');
      }
  } catch (error) {
      // Handle network errors or exceptions
      console.error("Error searching users:", error);
      alert('An error occurred while trying to search for users.');
  }
  openModal();
}

// function to delete cookie and logout
async function logout() {
  try {
    const response = await fetch('/M00874694/login', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    console.log(result);
    alert("successfully logged out")
    HideLogOut()
    loggedInUser.innerText = "Create an account or login";
    const friendsList = document.getElementById('friendsList');
    // Clear existing list
    friendsList.innerHTML = '';
    fetchAndDisplayFollowingPosts();


  } catch (err) {
    console.log("Error loading: " + err);
  }
}

//file uploading AJAX
const serverResponse = document.getElementById("serverResponse")
serverResponse.innerHTML = "";
async function uploadFile() {
  let fileArray = document.getElementById("myFile").files;
  if(fileArray.length !== 1 && postText == "") {
    serverResponse.innerHTML = "select 1 file to upload or write something to post";
    return;
  }

  const formData = new FormData();
  formData.append('myFile', fileArray[0]);

  try {
    const response = await fetch ("/M00874694/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);
    serverResponse.innerHTML = `File uploaded successfully: ${result.filename}.`;
    if(result.filename === undefined){
      serverResponse.innerHTML = "Create a account or login to create a post"
      return;
    }
    let imgPreview = document.getElementById("imgPreview");
    imgPreview.innerHTML = `<img width="100" src="../uploads/${result.filename}">`;
  }
  catch (error) {
    console.log("Error:", error)
  }
}

async function post() {
  const postTitle = document.getElementById("postTitle").value;
  const postText = document.getElementById("postText").value;
  try {
    const response = await fetch('/M00874694/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: postTitle, text: postText})
    });
    const result = await response.json();
    console.log(result);  
  }
  catch (err) {
    console.log("error loading " + err);
  }
}

async function fetchAndDisplayFollowingPosts() {
  try {
    const response = await fetch('/M00874694/followingPosts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Credentials': 'include', // Ensure this is correct for your auth setup. It might be 'credentials'.
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = ''; // Clear existing posts
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      // Assuming each post object includes a 'authorPhone' property
      postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-content">${post.text}</p>
        <p class="post-author">Author: ${post.phone}</p>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error displaying posts:", error);
  }
}

createPost = () =>{
  //uploadFile();
  post();
}

//fixture list api
async function fetchFixtures() {
  const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2023&team=33&next=10';
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '1657e94062mshd3a8a6935b890dcp1c6966jsne86de4ad73e9',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      
      const data = await response.json();

      displayFixtures(data.response);
  } catch (error) {
      console.error(error);
      document.getElementById('apiBox1').textContent = 'Failed to load data.';
  }
}

function displayFixtures(fixtures) {
  const container = document.getElementById('apiBox1');
  container.innerHTML = ''; // Clear previous content
  if (!fixtures || fixtures.length === 0) {
      container.textContent = 'No fixtures found.';
      return;
  }

  fixtures.forEach(({fixture, teams}) => {
      const fixtureElement = document.createElement('p');
      fixtureElement.innerHTML = `${teams.home.name} VS ${teams.away.name}<br>`;
      container.appendChild(fixtureElement);
  });
}
fetchFixtures();

//player list api
async function fetchPlayerList() {
  const url = 'https://api-football-v1.p.rapidapi.com/v3/players/squads?team=33';
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '1657e94062mshd3a8a6935b890dcp1c6966jsne86de4ad73e9',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      
      const data = await response.json(); // Parse the response as JSON

      displayPlayers(data.response[0].players); // Assuming the response structure
  } catch (error) {
      console.error(error);
      document.getElementById('apiBox2').textContent = 'Failed to load data.';
  }
}
fetchPlayerList();

function displayPlayers(players) {
  const container = document.getElementById('apiBox2');
  container.innerHTML = ''; // Clear previous content
  if (!players || players.length === 0) {
      container.textContent = 'No players found.';
      return;
  }

  // Create a table and a thead element
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  table.appendChild(thead);

  // Create the header row
  const headerRow = document.createElement('tr');
  const headers = ['Player Name', 'Player Number', 'Player Age'];
  headers.forEach(headerText => {
      const header = document.createElement('th');
      header.textContent = headerText;
      headerRow.appendChild(header);
  });
  thead.appendChild(headerRow);

  // Create and fill the table body
  const tbody = document.createElement('tbody');
  players.forEach(player => {
      const row = document.createElement('tr');
    
      const nameCell = document.createElement('td');
      nameCell.textContent = player.name;
      row.appendChild(nameCell);
      const numberCell = document.createElement('td');
      numberCell.textContent = player.number ? player.number : 'N/A';
      row.appendChild(numberCell);
      const ageCell = document.createElement('td');
      // Assuming the player object has an 'age' property
      ageCell.textContent = player.age ? player.age : 'N/A';
      row.appendChild(ageCell);
      tbody.appendChild(row);
  });
  table.appendChild(tbody);
  // Append the table to the container
  container.appendChild(table);
}


