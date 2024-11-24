var express = require('express');
// var deeplink = require('node-deeplink');

var app = express();


function deepLink(options) {
    var fallback = options.fallback || '';
    var url = options.url || '';
    var iosStoreLink = options.ios_store_link;
    var androidPackageName = options.android_package_name;
    var playStoreLink =
        'https://market.android.com/details?id=' + androidPackageName;
    var ua = window.navigator.userAgent;

    // split the first :// from the url string
    var split = url.split(/:\/\/(.+)/);
    var scheme = split[0];
    var path = split[1] || '';

    var urls = {
        deepLink: url,
        iosStoreLink: iosStoreLink,
        android_intent:
            'intent://' +
            path +
            '#Intent;scheme=' +
            scheme +
            ';package=' +
            androidPackageName +
            ';end;',
        playStoreLink: playStoreLink,
        fallback: fallback
    };

    var isMobile = {
        android: function () {
            return /Android/i.test(ua);
        },
        ios: function () {
            return /iPhone|iPad|iPod/i.test(ua);
        }
    };

    // fallback to the application store on mobile devices
    if (isMobile.ios() && urls.deepLink && urls.iosStoreLink) {
        iosLaunch();
    } else if (isMobile.android() && androidPackageName) {
        androidLaunch();
    } else {
        window.location = urls.fallback;
    }

    function launchWekitApproach(url, fallback) {
        document.location.href = url;
        setTimeout(function () {
            document.location.href = fallback;
        }, 250);
    }

    function launchIframeApproach(url, fallback) {
        var iframe = document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
            document.location.href = url;
        };
        iframe.src = url;

        window.onload = function () {
            document.body.appendChild(iframe);

            setTimeout(function () {
                window.location = fallback;
            }, 25);
        };
    }

    function iosLaunch() {
        // chrome and safari on ios >= 9 don't allow the iframe approach
        if (
            ua.match(/CriOS/) ||
            (ua.match(/Safari/) && ua.match(/Version\/(9|10|11|12)/))
        ) {
            launchWekitApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
        } else {
            launchIframeApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
        }
    }

    function androidLaunch() {
        if (ua.match(/Chrome/)) {
            document.location.href = urls.android_intent;
        } else if (ua.match(/Firefox/)) {
            launchWekitApproach(urls.deepLink, urls.playStoreLink || urls.fallback);
        } else {
            launchIframeApproach(url, urls.playStoreLink || urls.fallback);
        }
    }
}
app.get(
    '/deeplink',
    (req, res) => {
        deepLink({
            url: req.query.url,
            fallback: 'https://orinabiji.ge',
            android_package_name: 'ge.orinabiji.shop',
            ios_store_link:
                'https://apps.apple.com/ge/app/2-nabiji/id1635766103'
        })
        res.json()
    }
);
const port = 3003;


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})