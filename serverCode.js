function myFunction() {
    // fetch from TE
    let opts = { "headers": {"Authorization": "Bearer ecda56df-c620-4258-871b-02f893179669"}}
    let response = UrlFetchApp.fetch("https://api.thousandeyes.com/v6/web/http-server/2156329.json",opts)
    response = JSON.parse(response)
    Logger.log(response)
    var andy = new Date().getTime();
    //Logger.log("AgentID" + response.web.test.testName)
  
    // stage data
    let payload = {
      "syntheticEngineName": "Thousand Eyes",
      "syntheticEngineIconUrl": "https://static.thenounproject.com/png/1745-200.png",
      "messageTimestamp": andy,
      "locations": [
          {
              "id": response.web.httpServer[0].agentId,
              "name": response.web.httpServer[0].agentName,
              "ip": response.web.httpServer[0].serverIp
          }
      ],
      "tests": [
          {
              "id": "2156329",
              "title": response.web.test.testName,
              "description": "ThousandEyes external synthtic",
              "drilldownLink": response.web.httpServer[0].permalink,
              "locations": [
                  {
                      "id": response.web.httpServer[0].agentId,
                      "enabled": true
                  }
              ],
              "steps": [
                  {
                      "id": 1,
                      "title": "Step1"
                  }
              ],
              "scheduleIntervalInSeconds": 300,
              "noDataTimeout": 5000
          }
      ],
      "testResults": [
          {
              "id": "2156329",
              "scheduleIntervalInSeconds": 300,
              "totalStepCount": 1,
              "locationResults": [
                  {
                      "id": response.web.httpServer[0].agentId,
                      "startTimestamp": andy,
                      "successRate": 1,
                      "success": true,
                      "responseTimeMillis": response.web.httpServer[0].responseTime,
                      "stepResults": [
                          {
                              "id": 1,
                              "startTimestamp": andy,
                              "responseTimeMillis": response.web.httpServer[0].responseTime
                          }
                      ]
                  }
              ]
          }
      ]
    }
  
    // send to DT
    opts.headers = {"Authorization": "Api-Token dt0c01.XCF2LMEOSRXWQECSZCWYEVVV.WALMMTIAUVAV6T6DHM6TOFWBDRI2O4ZRMOHGVV3TBRFIQZRQX3YPLU4G4H3N57OL",
        "Content-Type": "application/json", "Accept": "application/json"}
    opts.method = "post"
    opts.payload = JSON.stringify(payload)
    Logger.log(opts.payload)
    response = UrlFetchApp.fetch("https://luu74425.live.dynatrace.com/api/v1/synthetic/ext/tests", opts);
  }
  
  
  
  function alerts() {
    // fetch from TE
    let opts = { "headers": {"Authorization": "Bearer ecda56df-c620-4258-871b-02f893179669"}}
    let alerts = UrlFetchApp.fetch("https://api.thousandeyes.com/v6/alerts.json",opts)
    alerts = JSON.parse(alerts)
    Logger.log(alerts.alert[0].active)
    //var andy = new Date().getTime();
    //Logger.log(andy)
  
  // Loop through open alerts
  for (var i in alerts.alert){
  let alertIds = alerts.alert[i].alertId
  //Logger.log(alertResponse.alert[i].alertId)
  //Logger.log(alertIds)
  let alertIdsArray = UrlFetchApp.fetch("https://api.thousandeyes.com/v6/alerts/" + alertIds +".json",opts)
  alertIdsArray = JSON.parse(alertIdsArray)
  Logger.log(alertIdsArray)
  //Get Event details
  
    // stage Event data
    let eventPayload = {
          "title": alertIdsArray.alert[i].ruleName,
          "source": "Thousand Eyes",
          "description": "ThousandEyes event ID:" + alertIdsArray.alert[i].alertId,
          "eventType": "PERFORMANCE_EVENT",
          "timeoutMinutes": "10",
          "attachRules": {
              "tagRule": [
                  {
                      "meTypes": [
                          "APPLICATION"
                      ],
                      "tags": [
                          {
                              "context": "CONTEXTLESS",
                              "key": "Sephora"
                          }
                      ]
                  }
              ]
          },
          "customProperties": {
              "Link": alertIdsArray.alert[i].permalink
          }
      }
  Logger.log(eventPayload)
  
  
  
    // send to DT
    opts.headers = {"Authorization": "Api-Token dt0c01.XCF2LMEOSRXWQECSZCWYEVVV.WALMMTIAUVAV6T6DHM6TOFWBDRI2O4ZRMOHGVV3TBRFIQZRQX3YPLU4G4H3N57OL",
        "Content-Type": "application/json", "Accept": "application/json"}
    opts.method = "post"
    opts.payload = JSON.stringify(eventPayload)
    Logger.log(opts.payload)
    response = UrlFetchApp.fetch("https://luu74425.live.dynatrace.com/api/v1/events", opts);
  }
  }
  
  
  function doGet(e){
    doPost(e);
  }
  
  function doPost(e) {
    return ContentService.createTextOutput("Hello World!")
            .setMimeType(ContentService.MimeType.TEXT);
  }