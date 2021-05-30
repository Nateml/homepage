const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const recycleItem = (array, index) => {
  // Places item at given index at the end of the array, and shifts everything else down to fill in the gap
  let indexItem = array[index]
  for (let i = index; i < array.length; i++) {
    if (i == array.length - 1) {
     array[i] = indexItem 
    } else {
      array[i] = array[i+1]
    }
  }
}

// const storedTextFile = await getFileStorage({name: 'homepage-stored-files'})
const textfileUrl = 'https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt'

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response;
}

if (window.localStorage.getItem("commonWords") == null) {
  fetch(textfileUrl)
    .then(handleErrors)
    .then( r => r.text())
    .then(t => {
      window.localStorage.setItem("commonWords", t)
    })
    .catch(e => console.log("Could not retrieve list of commonly used words"))
  }

var commonWords = window.localStorage.getItem("commonWords").split('\n')
var commonwWords = shuffleArray(commonWords)

document.getElementById("currentword").innerHTML = commonWords[0]
document.getElementById("followingwords").innerHTML = commonWords.slice(1, commonWords.length).join(" ")


var input = document.getElementById("searchbar");

//var wordfeed = document.getElementById("wordfeed")


/*
input.addEventListener("pointerenter", () => (
  document.getElementById("typingwords").style.opacity = "50%"
))

input.addEventListener("pointerleave", () => (
  document.getElementById("typingwords").style.opacity = "0%"
))
*/

function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
      if( el.style[t] !== undefined ){
          return transitions[t];
      }
  }
}

var typingTestStarted = false
var wordsCorrect = 0
var wordsEntered = 0
var curTypedWord = ""

input.onfocus = () => {
  var transitionEnd = whichTransitionEvent();

  input.addEventListener(transitionEnd, theFunctionToInvoke, false);

  function theFunctionToInvoke(){
    if (document.activeElement === input && document.hasFocus() && input.value.length == 0) {
      input.placeholder = ""
      document.getElementById("typingwords").style.opacity = 1
      document.getElementById("currentword").style.opacity = 1
      document.getElementById("followingwords").style.opacity = 0.3
    } 
  }

}

input.onblur = () => {
  document.getElementById("typingwords").style.opacity = "0%"
  typingTestStarted = false
  charPositionInWord = 0
  wordsCorrect = 0
  wordsEntered = 0
  curTypedWord = ""

  input.placeholder = " Search with DuckDuckGo..."

}


input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    var keyword = document.getElementById("searchbar").value;
    var searchvalue = keyword.replace(/ /g, "+");
    console.log(searchvalue);
    document.getElementById("searchbar").value = "";
    window.location.href = "https://duckduckgo.com/?q=" + searchvalue;
  }
});

var starttime = Date()
var wpm = 0
var charPositionInWord = 0

input.addEventListener("keydown", (event) => {
  console.log(event.key)
  if (event.key == " ") {

    console.log("space entered")

    let enteredWord = document.getElementById("searchbar").value;
    
    if (typingTestStarted) {
      charPositionInWord = 0
      wordsEntered++
      console.log(curTypedWord)
      if (curTypedWord == commonWords[0]) {
        wordsCorrect++
      }
      recycleItem(commonWords, 0)

      document.getElementById("currentword").innerHTML = commonWords[0].split("").slice(0, charPositionInWord).join("") + "<span id='currentcharacter' class='currentcharacter'>" + commonWords[0].split("")[charPositionInWord] + "</span> " + commonWords[0].split("").slice(charPositionInWord + 1, commonWords[0].split("").length).join("") 
      document.getElementById("followingwords").innerHTML = commonWords.slice(1, commonWords.length).join(" ")
      document.getElementById("searchbar").value = ""
      curTypedWord = ""
      duration = (new Date()) - starttime
      console.log(duration)
      wpm = Math.round((wordsCorrect / (duration / 60000)) * 10) / 10
      console.log(wpm)
      document.getElementById("wpm").innerHTML = wpm + " WPM"
    } else {
      if (enteredWord == commonWords[0]) {
        console.log("started")
        starttime = new Date()
        typingTestStarted = true
        document.getElementById("searchbar").style.cursor = "transparent"
        recycleItem(commonWords, 0)
        document.getElementById("currentword").innerHTML = commonWords[0].split("").slice(0, charPositionInWord).join("") + "<span id='currentcharacter' class='currentcharacter'>" + commonWords[0].split("")[charPositionInWord] + "</span> " + commonWords[0].split("").slice(charPositionInWord + 1, commonWords[0].split("").length).join("") 
        document.getElementById("followingwords").innerHTML = commonWords.slice(1, commonWords.length).join(" ")
        document.getElementById("searchbar").value = ""
      } else {
        document.getElementById("typingwords").style.opacity = "0%"
      }
    }

  } else if (event.key == "Escape" && typingTestStarted) {
    typingTestStarted = false
    charPositionInWord = 0

    document.getElementById("typingwords").style.opacity = 0
    document.getElementById("searchbar").value = wpm + " wpm"

  } else {
    if (typingTestStarted) {
      curTypedWord += event.key
      
      if (document.getElementById('currentcharacter').innerHTML == event.key){
        charPositionInWord++
        if (charPositionInWord < commonWords[0].length - 1) {
          document.getElementById("currentword").innerHTML = commonWords[0].split("").slice(0, charPositionInWord).join("") + "<span id='currentcharacter' class='currentcharacter'>" + commonWords[0].split("")[charPositionInWord] + "</span> " + commonWords[0].split("").slice(charPositionInWord + 1, commonWords[0].split("").length).join("") 
        } else if (charPositionInWord < commonWords[0].length) {
          document.getElementById("currentword").innerHTML = commonWords[0].split("").slice(0, charPositionInWord).join("") + "<span id='currentcharacter' class='currentcharacter'>" + commonWords[0].split("")[charPositionInWord] + "</span> " + " "
        } else if (charPositionInWord < commonWords[0].length) {
        } else {
          document.getElementById("currentword").innerHTML = commonWords[0]
        }
      }
      
    }
  }

  if (typingTestStarted) {
    event.preventDefault()
  }
})