var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
document.write(hour.toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + ":" + min.toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}));

/*
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("typingWords").style.visibility = "hidden";
})
*/
console.log("Done!");