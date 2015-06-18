#!/usr/bin/env node

var pkg = require("./package.json")
var request = require("request");
var docopt = require("docopt").docopt;
var Promise = require("promise");

var doc = [
    "This program helps you test a MSISDN Gateway server from the CLI.",
    "Usage:",
    "  index --host=<host> --mcc=<mcc> [(--audience=<audience> (--dry-run | --login-endpoint=<endpoint>))] [(--data=<data> | --json=<json>)] [--insecure] [options]",
    "  index --host=<host> --mcc=<mcc> [(--audience=<audience> --dry-run --login-endpoint=<endpoint>)] [(--data=<data> | --json=<json>)] [--insecure] [options]",
    "  index -h | --help",
    "  index --version",
    "Options:",
    "  -h --help                       Show this screen.",
    "  --version                       Show version.",
    "  -H --host=<host>                The MobileID host",
    "  -c --mcc=<mcc>                  Mobile Country Code (3 digits) ie: 214",
    "  --mnc=<mnc>                     Mobile Network Code (2 or 3 digits) ie: 07",
    "  -n --msisdn=<msisdn>            The MSISDN number you want to validate.",
    "  -v, --verbose                   Display the assertion",
    "  -k, --insecure                  Allow wrong SSL configuration",
    "  -s, --dry-run                   Only display the cURL command to run",
    "  -a, --audience=<audience>       The Service Provider audience",
    "  -l, --login-endpoint=<endpoint> The Service Provider login endpoint",
    "  -d, --data=<data>               The data send as x-www-form-urlencoded",
    "  -j, --json=<json>               The data send as json"

].join('\n');


var args = docopt(doc, {
    version: pkg.version
});
var host = args["--host"].replace(/\/*$/g, "");
var headers = {"Content-type": "application/json"};

var verify = true;
if (args["--insecure"]) {
    verify = false;
}


// 1. Start the discover
new Promise(function (resolve, reject) {
    var url = host.concat("/discover");
    var discover_args = {"mcc": args["--mcc"], "roaming": false};
    if (args["--mnc"]) {
     discover_args["mnc"] = args["--mnc"];
    }
    if (args["--msisdn"]) {
     discover_args["msisdn"] = args["--msisdn"];
    }

    var options = {
        url: url,
        headers: headers,
        method: "POST",
        body: JSON.stringify(discover_args)
    };

    request.post(options, function(error, response, body) {
        if (error) throw error;
        if (response.statusCode != 200) {
            //console.log(response);
            throw response;
        }else{
            resolve(response);
        }
    });
}).then(function(response) {
    var discover = response;
});

// var register_request = request.post(options, function(error, response, body) {
//     if (error) throw error;
//     if (response.statusCode != 200) {
//         console.log(response);
//     }else{
//         console.log('success');
//     }
// });

