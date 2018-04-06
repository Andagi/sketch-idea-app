//////////////    Initialize Firebase  //////////////////////
  var config = {
    apiKey: "AIzaSyBrTofR6KU8K0hGo-uV12vL5JjCL0dGhkc",
    authDomain: "sketchideaapp.firebaseapp.com",
    databaseURL: "https://sketchideaapp.firebaseio.com",
    projectId: "sketchideaapp",
    storageBucket: "",
    messagingSenderId: "151211874811"
  };
  firebase.initializeApp(config);
/// END FIREBASE ///

let githubAuth = new firebase.auth.GithubAuthProvider();

// eventlistener for the click "submit" button, 
//   retrieve text from "userinput"
//   send text from "userinput" to firebase database
//   display text 'added' to ID "Added" section

//DOM elements

/////HTML to JS
let usernameElem = document.getElementById("username");
let userInfoElem = document.getElementById("userinfo");
let loginElem = document.getElementById("login");
let logoutElem = document.getElementById("logout");

let userInput = document.getElementById("userinput").value;
let submitElem = document.getElementById("submit");
let currentdisplayElem = document.getElementById("currentdisplay");
let randomElem = document.getElementById("random");
let addedPromptElem = document.getElementById("added");

//firebase paths
let dbSketchIdea = firebase.database().ref("prompts");

submitElem.addEventListener("click", submitTextElem);

  // Upon activing the function, updating the value of userInput from the original definition at the start of the page
function submitTextElem() {
  userInput = document.getElementById("userinput").value;
  dbSketchIdea.push(userInput);
  addedPromptElem.textContent = "\"" + userInput + "\"" + " Added!";
  console.log(userInput);
}

///////////////////////////////////////////////////USER LOGIN/LOGOUT SECTION/////////////////////////////////
/////login/logout section
loginElem.addEventListener("click", loginClick);

function loginClick() {
  firebase.auth().signInWithPopup(githubAuth).catch(function(error) {
  console.log(error);
  });
}

logoutElem.addEventListener("click", logoutClick);

function logoutClick() {
  // Use Firebase to log out the current user
firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
  console.log(error);
  userInfoElem.textContent = "You successfully logged out!";
  });

}

//////changes depending on state of login/logout
firebase.auth().onAuthStateChanged(handleAuthStateChange);


function handleAuthStateChange(user) {
  if(user) {    
    console.log("You logged in!");
    userInfoElem.textContent = "You are now logged in!";
    usernameElem.textContent = "Welcome, " + user.displayName + "!";
    
    let currentUserRef = firebase.database().ref("users/" + user.uid);  

      // Listen for current user's profile info (initialize it and also update in real-time when it changes!)
      currentUserRef.on("value", function(dataSnapshot) {
      //Create an "if" statement to see if user exists
      if(!dataSnapshot.val() ) {
        let newUser = {name: user.displayName, email: user.email};
        //adding user to my database
        currentUserRef.set(newUser);
        console.log("tHis works");
       } else {
          console.log("user already exists");
        }
      } );
    
    let addPromptList = document.createElement("div");
    document.body.insertBefore(picDiv, usernameElem);
    let userPic = new Image (200, 200);
    userPic.src = null
      
  } else {
    console.log("You're not logged in.");
    userInfoElem.textContent = "You are not logged in.";
    usernameElem.textContent = "";
    }
}

///////////////////////////////////////////////////END USER LOGIN/LOGOUT SECTION/////////////////////////////////



///////////////////////////////////////////////////START RANDOMIZE SECTION/////////////////////////////////

// eventlistener for the click "random" text,
//  retrieve prompt folder from firebase
//  retrive random HASH# from prompt folder
//  display string in current display ID

randomElem.addEventListener("click", displayRandomElem);

//Trying a Stack overflow of randomizing elements
function displayRandomElem() {
  // https://stackoverflow.com/questions/45145596/get-random-item-from-firebase

  // convert all data into strings
  // dbSketchIdea.limitToFirst(randomIndex).limitToLast(1).once("value").then(displayPrompt);
  
  firebase.database().ref("prompts").on("value", displayPrompt);

  function displayPrompt(dataSnapshot) {
    let promptAll = dataSnapshot.val();
    //currentdisplayElem.textContent = promptAll;
    console.log(promptAll);
    
    let newPromptArray = [];
    
    // for all key:value pairs, grab the key
    for (const key in promptAll) {
      newPromptArray.push(promptAll[key]);
      //console.log(promptAll[key]); see values displayed
  }
    // console.log(newPromptArray);
    
    let randomIndex = Math.floor(Math.random() * newPromptArray.length);
    
    console.log(newPromptArray[randomIndex]);
    
    currentdisplayElem.textContent = newPromptArray[randomIndex];
    
    console.log(randomIndex);
    //list.lenght
  
   }
  
  
}
///////////////////////////////////////////////////END RANDOMIZE SECTION/////////////////////////////////



  // Retrieved data is all listed 
  // Find a way to randomize the data already gathered




//"Refactoring"




// FUTURE NOTE: Generate ID #s automatically to keys

// dbSketchIdea.push("Trees"); this refreshes everytime the page refreshes


// FIREBASE TEST //
// let dbTestRef = firebase.database().ref("test");

// dbTestRef.set("prompts");

// dbTestRef.on("value", displayFirebaseTest);

// changed dataSnapshot to banana for testing purposes
// function displayFirebaseTest(banana) {
//   currentdisplayElem.textContent = banana.val();
// }
    
