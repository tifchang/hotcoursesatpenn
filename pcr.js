var express = require("express");
var request = require("request");
var fs = require("fs");
var app = express();

// token = KBfHZ21jf6e0bED2FQRkx_Ex42NvEv

app.get('/', function(req, res) {
  res.send('Hello.')
});

// Writes to test.json
function write(input) {
 fs.writeFile('./test.json', JSON.stringify(input), function(e) {
   if (e) {
     res.status(404).send('Error');
     return;
   }
 })
}

// Reading PCA data
fs.readFile('./courses.json', "utf8", (err, data) => {
  if (err) throw err;
  var pca = JSON.parse(data);
  var coursecode = Object.keys(pca).map((k) => {
    // console.log(pca[k].course);
    return '2016a-' + pca[k].course;
  });
  setTimeout(function() {
    pull_pcrdata(coursecode);
  }, 5000);
  // console.log(coursecode.length);
});

// Courses to retrieve data on
var allcourses = {};
// Get reviews for each course
function pull_pcrdata(coursecode) {
  coursecode.forEach(e => {
    request('http://api.penncoursereview.com/v1/courses/'+ e +'/reviews?token=KBfHZ21jf6e0bED2FQRkx_Ex42NvEv',
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(JSON.parse(body).result.values[0].id)
        var id = JSON.parse(body).result.values[0].id;
        allcourses[id] = JSON.parse(body).result.values[0];
      }
    });
  });
}


// Write out to file after coursecode is complete
setTimeout(function() {
  write(allcourses);
  // console.log("DONE");
}, 120000)

app.listen(3000);
console.log("Started");
