var pkg = require("./package.json")
var request = require("request");
var doc, docopt;

doc = [
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


docopt = require("docopt").docopt;

var arguments = docopt(doc, {
  version: pkg.version
});
console.log(arguments);
var host = arguments["--host"].replace(/\/*$/g, "");
var headers = {"Content-type": "application/json"};

var verify = true;
if (arguments["--insecure"]) {
	verify = false;
}

// 1. Start the discover
var url = host.concat("/discover");
discover_args = {"mcc": arguments["--mcc"], "roaming": false};
if (arguments["--mnc"]) {
	discover_args["mnc"] = arguments["--mnc"];
}
if (arguments["--msisdn"]) {
	discover_args["msisdn"] = arguments["--msisdn"];
}

var options = {
	url: url,
	headers: headers
};