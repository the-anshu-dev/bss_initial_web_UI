function doGet(e) {
  var x = HtmlService.createTemplateFromFile("index1");
  var y = x.evaluate();
  var z = y.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return z;
}

function checkLogin(username, password) {
  var url = 'https://docs.google.com/spreadsheets/d/1CvkuEBK0ewIhiVFkqUdeq5NAOQdP-5Nvpmuf2Nu47K0/edit#gid=0';
  var ss= SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("Attender_Login_DB");
  var getLastRow =  webAppSheet.getLastRow();
  var found_record = '';
  for(var i = 1; i <= getLastRow; i++)
  {
   if(webAppSheet.getRange(i, 1).getValue().toUpperCase() == username.toUpperCase() && 
     webAppSheet.getRange(i, 2).getValue().toUpperCase() == password.toUpperCase())
   {
     found_record = 'TRUE';
   }    
  }
  if(found_record == '')
  {
    found_record = 'FALSE'; 
  }
  
  return found_record;
  
}

function AddRecord(usernamee, passwordd, email, phone,date,gender,ami) {
  var url = 'https://docs.google.com/spreadsheets/d/1CvkuEBK0ewIhiVFkqUdeq5NAOQdP-5Nvpmuf2Nu47K0/edit#gid=0';
  var ss= SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("Attender_Login_DB");
  webAppSheet.appendRow([usernamee,passwordd,email,phone]);
  
}
