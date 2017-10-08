// https://script.google.com/d/1p705Zda6ZoltYefOaJur_cPAo74MyDK1p8D32ZupQqncDm4B7-He2c3k/edit?usp=sharing

var baseUrl = "http://aiwvu.ml:5001/"

function doGet() {
  var results = [];
  var threads = GmailApp.getInboxThreads();
  for (var i in threads) {
    results.push({
      subject: threads[i].getFirstMessageSubject(),
      body: threads[i].getMessages()[0].getPlainBody(),
      date: threads[i].getMessages()[0].getDate()
    });
  }
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}

function getUrls(message) {
  var matches = message.match(/\bhttps?:\/\/\S+/gi);
  return matches;
}

function periodicProcess() {
  var unread = GmailApp.getInboxUnreadCount();
  if (unread > 0) {
    var threads = GmailApp.getInboxThreads();
    for (var i in threads) {
      if (threads[i].isUnread()) {
        var category = threads[i].getFirstMessageSubject();
        var urls = getUrls(threads[i].getMessages()[0].getPlainBody());
        for (var j in urls) {
          var url = baseUrl + "?category=" + category + "&url=" + urls[j];
          Logger.log(url);
          try {
            UrlFetchApp.fetch(url);
            threads[i].markRead();
          } catch(e) {}
        }
        threads[i].reply("Request processed");
      }
    }
  }
}