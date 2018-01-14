  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDXOldb8RHiQiy4QwyB0_C42nnA_V609vs",
    authDomain: "sara-train-scheduler.firebaseapp.com",
    databaseURL: "https://sara-train-scheduler.firebaseio.com",
    projectId: "sara-train-scheduler",
    storageBucket: "sara-train-scheduler.appspot.com",
    messagingSenderId: "960098055959"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

$("#submit").on("click", function(event){
  event.preventDefault();

  var name = $('#name-input').val().trim();
  var minutesUntil;
  var dest = $('#dest-input').val().trim();
  var firstTrain = $('#first-input').val().trim();
  var frequency = $('#freq-input').val().trim();
  var currentTime = moment();
  var firstTrainConverted = moment(firstTrain, "HH:mm");
  console.log(firstTrainConverted);
  var diffTime = currentTime.diff(moment(firstTrainConverted), "minutes");
  console.log(diffTime + "here is diffTime");
  console.log(moment(firstTrainConverted));
  var tRemainder = diffTime % frequency;
  var futureDetermination = function() {
    if (firstTrainConverted > currentTime) { //PROBLEM MUST BE HERE
      minutesUntil = Math.abs(diffTime) + 1;
    } else {
      minutesUntil = frequency - tRemainder;
    }
  };

  futureDetermination();

  var next = currentTime.add(minutesUntil, "minutes");

  var nextDisplay = moment(next).format("hh:mm a");

  database.ref().push({ 
    trainName: name,
    trainDest: dest,
    trainFirst: firstTrain,
    trainFrequency: frequency,
    nextTime: nextDisplay,
    minutesAway: minutesUntil
  })

})

database.ref().on("child_added", function(childSnapshot){

  $('.table').prepend("<tr><td></td><td></td><td></td><td class='next'></td><td class='minutes-away'></td></tr>");  

      var firstRowTds = $("table")
        .children()
        .eq(1)
        .children("tr")
        .eq(0)
        .children("td");

      firstRowTds.eq(0).text(childSnapshot.val().trainName);

      firstRowTds.eq(1).text(childSnapshot.val().trainDest);

      firstRowTds.eq(2).text(childSnapshot.val().trainFrequency);

      firstRowTds.eq(3).text(childSnapshot.val().nextTime);

      firstRowTds.eq(4).text(childSnapshot.val().minutesAway);

})
