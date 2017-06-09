// Initialize Firebase
var config = {
  apiKey: "AIzaSyATWonhAmLLrKjzncS5HVaWtNcPYR98rrU",
  authDomain: "train-scheduler-d9ff3.firebaseapp.com",
  databaseURL: "https://train-scheduler-d9ff3.firebaseio.com",
  projectId: "train-scheduler-d9ff3",
  storageBucket: "train-scheduler-d9ff3.appspot.com",
  messagingSenderId: "195433976227"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#addUser").on("click", function(event){
      event.preventDefault();
      var name = $("#name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = parseInt($("#freq").val().trim());

      //convert firstTrain time into Unix time
      var firstTrainUnix = moment(moment(firstTrain, "hh:mm")).format("X");

      // push to firebase
      database.ref().push({
        name: name,
        destination: destination,
        firstTrainUnix: firstTrainUnix,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      alert("The Train schedule was added");
      //empty input on html
        $("#name").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#freq").val("");
});

//retrieve data from firebase
database.ref().on("child_added", function(snap){
  // console.log(snap.val().name);
  var name = snap.val().name;
  var destination = snap.val().destination;
  var freq = snap.val().freq;
  var firstTrainUnix = snap.val().firstTrainUnix;

  //start calculate time
  var currentTime = moment();

  //conver firstTrainUnix time into pretty time
  var firstTrain = moment.unix(firstTrainUnix).format();

  //push back 1 year
  var firstTrainConverted = moment(firstTrain).subtract(1, "years").format();

  //minute diff
  var diffTime = currentTime.diff(firstTrainConverted, "minutes");


  var tRemainder = diffTime % freq;
  var tMinutesTillTrain = freq - tRemainder;
  var nextArr = moment(moment().add(tMinutesTillTrain, "minutes")).format("hh:mm");

//display
  $("#display > tbody").append(
    "<tr><td>" + name + "</td>" +
    "<td>" + destination + "</td>" +
    "<td>" + freq + "</td>" +
    "<td>" + nextArr + "</td>" +
    "<td>" + tMinutesTillTrain + "</td>" + "</tr>");
}, function(err){
  console.log(err.code);
});
