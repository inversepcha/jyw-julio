
if (location.hostname == 'localhost' || location.hostname == '192.168.1.252') {

  var environment = {
    production: true,
    url:'http://192.168.1.252:3001'

  };

 } else {
  var environment = {
    production: true,
    url:'http://181.143.22.234:3001'

  };
 }


 export { environment }
