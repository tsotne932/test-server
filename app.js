var express = require('express');
var deeplink = require('node-deeplink');
 
var app = express();
 
app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://orinabiji.ge',
    android_package_name: 'ge.orinabiji.shop',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
  })
);
const port = 3003;


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})