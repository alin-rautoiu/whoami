var express = require('express');
var app = express();

function getOS(ua) {
    var ua;
    var oss = {};

    if (/mobile/i.test(ua))
        oss.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        oss.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        oss.iPhone = /iPhone/.test(ua);
        oss.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        oss.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[0];

    if (/webOS\//.test(ua))
        oss.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[0];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        oss.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        oss.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[0];

    var keys = Object.keys(oss);
    var os;
    keys.forEach(function(key, index, array){
        if(oss[key] !== null || oss[key] !== undefined) {
            os = oss[key];
        }
    });

    return os;    
}

app.get('/api/whoami', function(req, res) {
    var language = req.headers['accept-language'].split(',')[0];
    var software = req.headers['user-agent'];
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

    software = getOS(software);

    var whoAmIObject = {
        "ipaddress" : ip,
        "language" : language,
        "software" : software
    };

    res.type('application/json');
    res.send(whoAmIObject);
});

app.listen(process.env.PORT || 3002);