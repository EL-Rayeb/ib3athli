function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rowData = [];

  // Push the data to the rowData array
  rowData.push(new Date()); // Timestamp
  rowData.push(e.parameter.name); // Name
  
  // Replace certain words in the message
  var message = e.parameter.message;
  message = replaceWords(message);

  rowData.push(message); // Message

  // Append the rowData to the sheet
  sheet.appendRow(rowData);
  
  // Return an empty response after processing the form submission
  return ContentService.createTextOutput("");
}

function replaceWords(message) {
  // Define the word replacements
  var replacements = {
    // English curse words and variations
    "fuck": "f##k",
    "fuc k": "f##k",
    "fu*k": "f##k",
    "shit": "$#!t",
    "sh!t": "$#!t",
    "sh*t": "$#!t",
    "bitch": "b###h",
    "b!tch": "b###h",
    "bi*ch": "b###h",
    "asshole": "a##hole",
    "a$$hole": "a##hole",
    "a$$h0le": "a##hole",
    // Arabic curse words and variations
    "كسمك": "ك$#مك",
    "كس اختك": "ك$ اختك",
    "خرا": "خ#ا",
    "زب": "ز#ب",
    "زبالة": "ز$#الة",
    "زبر": "ز#ر",
    // Additional variations
    "zab": "z#b",
    "zib": "z#b",
    "zeb": "z#b",
    "zibi": "z#b",
    "zuba": "z#b",
    "zibo": "z#b",
    "zubo": "z#b",
    "zubu": "z#b",
    "miboun": "m$#!un",
    "mibouna": "m$#!una",
    // English letters with Arabic pronunciation and variations
    "kasemak": "k##mak",
    "kas akhtak": "k## akhtak",
    "khara": "kh#ra",
    // Additional Tunisian bad words
    "3asab": "3$ab",
    "neek": "n##k",
    "3as": "3$",
    "3os": "3$",
    "5ra": "5#ra",
    "5arya": "5#ra",
    "ta7an": "ta#an",
    "9a7ba": "9a#ba",
    "9a7 ba": "9a#ba",
    // Code replacement addition
    "<style>": "style",
  };
  
  // Iterate through the replacements and replace words in the message
  for (var word in replacements) {
    if (replacements.hasOwnProperty(word)) {
      var regex = new RegExp("\\b" + word + "\\b", "gi"); // Case insensitive whole word match
      message = message.replace(regex, replacements[word]);
    }
  }

  return message;
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var jsonData = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowData = {
      timestamp: row[0], // Timestamp
      name: row[1], // Name
      message: row[2] // Message
    };
    jsonData.push(rowData);
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
}


================ ken mazel famma klem mahowech mitzed iktbo louta ==============
function replaceWords(message) {
  var replacements = {
      // words that aren't added yet
      "sex": "s*x",
      "nik": "n##k",
      // add more
  }
}