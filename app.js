const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
var cloudwatchlogs = new AWS.CloudWatchLogs();


var params = {
    logGroupName: '/aws/lambda/Intruder_detection', /* required */
    logStreamName: '2021/06/15/[$LATEST]5bfa7e2828e7473eadb1d444f5518cf0', /* required */
    startFromHead: true
};


const analyse = (params)=>{
    cloudwatchlogs.getLogEvents(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else    data.events.forEach((data)=>{
            if((data.message.includes("MatchedFaces"))){
                const words = data.message.split('\t')
                const items = JSON.parse(words[3])
                if(items.FaceSearchResponse[0].MatchedFaces.length !== 0)
                {
                    const text =(items.FaceSearchResponse[0].MatchedFaces[0].Similarity)
                    $('#logs').append($('<div>').text('Similarity:' + text + '\n'));       
                }
            }
        })           
    });
}

module.exports =analyse()