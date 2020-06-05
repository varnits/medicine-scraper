const https= require ('https');
var express = require('express');
app=express();
var axios = require('axios');

var getJSON = require('get-json')


const request = require('request');
const fetch = require('node-fetch');
  app.get('/:query',function(req, res)  {   
    
  (async() => {
    var promiseFromCallMeds = await callmeds(req);
    var resultFromCallMeds = await promiseFromCallMeds;
    if(resultFromCallMeds[0].Available){
         
         console.log("object "+JSON.stringify(resultFromCallMeds[0]));
    }
         if(resultFromCallMeds[1].Available){
        
          console.log("object "+JSON.stringify(resultFromCallMeds[1]));
         }
          if(resultFromCallMeds[2].Available){
      console.log("object "+JSON.stringify(resultFromCallMeds[2]));
      }
        if(resultFromCallMeds[3].Available){
    
            console.log("object "+JSON.stringify(resultFromCallMeds[3]));
        }
            res.header("Access-Control-Allow-Origin", "*");
            res.send(resultFromCallMeds)
     res.end();

  })();
     
});   
app.get('/check/:query',function(req, res)  {   
    
  let settings = { method: "Get" ,
  headers: {
    "content-type": "application/json",
    }
};
  var url ='https://localhost:5001/'+req.params.query;
var s=  (async()=>{ fetch(url, settings)
      .then(resq => resq.json())
      .then((json) => {
          // do something with JSON
      //  return json;
         // res=json;
        });
        })();
       res.send(s);
     res.end();
    
  
});

async function netmeds1(query){

  var url ='https://3yp0hp3wsh-dsn.algolia.net/1/indexes/*/queries?'+
  'x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%3B%20instantsearch.js%20(4.4.0)%3B%20JS%20Helper%20(3.1.1)&x-algolia-application-id=3YP0HP3WSH&x-algolia-api-key=b7a2d287855abb4d0a80a1cbe9567ba9';
 // let settings = { method: "Get" ,con}; 
  var headers = {
    "Content-Type": "application/json"
  }
  var data=
 JSON.stringify({ "requests": [
    {
        "indexName": "prod_meds",
        "params": "clickAnalytics=true&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&query="+query+"&hitsPerPage=10&facets=%5B%5D&tagFilters="
    }
]
})
  
  return await fetch(url,{method :'POST',headers:headers,body:data})
  .then(res => res.json())
  .then((json) => {
      
      return json;
  });
  }
async function callmeds(req){
  console.log("Inside function callmeds");
  var arr=new Array();
   var ph =Object.fromEntries(await jsonParserpharmeasy((await pharmeasy(req.params.query))));

   var p =Object.fromEntries(await jsonParserPracto((await practo1(req.params.query))));
    //netmeds1(req.params.query);
   //let settings = { method: "Get" };
   //pharmeasy(req.params.query);
  
  var m =Object.fromEntries(await jsonParserMedlife((await medlife(req.params.query))));
  var n =Object.fromEntries(await(jsonParserNetMeds (await netmeds1(req.params.query))));
  //console.log("n "+n);
  arr.push(ph);
    arr.push(p);
    arr.push(m);
    arr.push(n);
 

  return arr;
}

async function pharmeasy(query){
  let settings = { method: "Get" };
  var url ='https://pharmeasy.in/api/search/search/?q='+query+'&page=1';
return await fetch(url,settings)
      .then(res => res.json())
      .then((json) => {
          // do something with JSON
        //  console.log(json);
        return json;
      });
  
// return await getJSON(url, function(error, response){   
//   console.log(response); 
// });
} 

async function practo1(query){
    var url ='https://www.practo.com/practopedia/api/v1/search?query='+query+'&pincode=560009';
    return await getJSON(url, function(error, response){    
    });
}
 


 
async function medlife(query){
    //app.get('/',function(req, res)  {
        var url ='https://rest.medlife.com/api/v1/search-micro-service/product-search/self-digitize/'+query+'?fcID=BLR13&pincode=560029&fcType=MEDLIFE_FC&mode=user';
    return await    getJSON(url, function(error, response){
           
      });
     
    }
app.listen(5001, '127.0.0.1');
console.log('Node server running on port 3000');


async function jsonParserPracto(stringValue) {

  
  // Add keys to the hashmap
    var n=stringValue.length;
    var i=0;
    while(i<n){

  //      console.log(stringValue[i].type.localeCompare("drug_combination"));
        if (stringValue[i].type.localeCompare("drug_combination")){
                if(stringValue[i].drug.is_available==true){
                break;
                }
        
        }
        
       i++;
    }

  var elements=new Map();
  var j=0;

  if(i==n){
    elements.set("Available",false);
    return elements;
  }
  elements.set("Available",true);

 // if(stringValue[i].drug.result_type.localeCompare("exact")==0){
        elements.set("OTC", (stringValue[i].drug.requires_prescription));
        elements.set(  "Drug_Name", (stringValue[i].drug.product_name) );
    if(stringValue[i].drug.hasOwnProperty("images"))
        elements.set("Photo", ( (stringValue[i].drug.images[0].res-150)));
        elements.set("Price", (stringValue[i].drug.mrp) );
        elements.set("real_Price", ((stringValue[i].drug.mrp)- (stringValue[i].drug.mrp*stringValue[i].drug.discount)/100));
        elements.set("Link","https://www.practo.com/medicine-info/"+stringValue.drug.slug);
 // }
    
 return (elements);
}

function jsonParserMedlife(stringValue) {

  //ee code na cholbe...arguments.length.toFixed.apply.call.bind


  
    // Add keys to the hashmap
      var n=stringValue.medicineList.length;
      var i=0;
      var elements=new Map();
    //
     // console.log("value "+JSON.stringify(stringValue.medicineList));
      if(n==0||n==undefined){
        console.log("false "+n);
        elements.set("Available",false);
          return elements;

      }
      elements.set("Available",true);
  
   
          elements.set("OTC", (stringValue.medicineList[0].rxDrug));
          elements.set("Drug_Name", (stringValue.medicineList[0].brandDesc));
          elements.set("Photo", (stringValue.medicineList[0].thumbnailURL));
          elements.set("Price", (stringValue.medicineList[0].mrp));
          elements.set("real_Price", (stringValue.medicineList[0].sellingPrice));


     
      
   return (elements);
}
function jsonParserNetMeds(stringValue) {
     
      var n=stringValue.results[0].hits.length;
       var i=0;
      var elements=new Map();
      console.log
while(i<n){
  if(  (stringValue.results[0].hits[i].availability_status).localeCompare("A")==0)
    break;
   i++; 
}

if(i==n){
  elements.set("Available",false);
  return elements;
}
elements.set("Available",true);
   console.log(stringValue.results[0].hits[i].availability_status);
           elements.set("OTC", (stringValue.results[0].hits[i].rx_required));
           elements.set("Drug_Name", (stringValue.results[0].hits[i].display_name));
           elements.set("Photo", (stringValue.results[0].hits[i].thumbnail_url));
           elements.set("Price", (stringValue.results[0].hits[i].mrp));
           elements.set("real_Price", (stringValue.results[i].hits[0].selling_price));
           elements.set("Link", "https://www.netmeds.com/prescriptions/"+(stringValue.results[0].hits[i].url_path));



     
           console.log("parser "+i);
      
   return (elements);
} 
async function jsonParserpharmeasy(stringValue) {
//  console.log(JSON.stringify(stringValue));
//var data=JSON.parse(stringValue);

//var n=stringValue.data.products;
var i=0;
var elements=new Map();
var b=stringValue.data.products;
var n=b.length;
//console.log(" " +b[0].productAvailabilityFlags.isAvailable);
while(i<n){
if(  (b[i].productAvailabilityFlags.isAvailable))
break;
i++; 
}
if(i==n){
  elements.set("Available",false);
  return elements;
}
elements.set("Available",true);

//console.log("pharmeasy +"+ b[i] );
 //console.log(" " +n);
 if(b[i].entityType==1)
 elements.set("OTC", false);
    else
 elements.set("OTC", true);

 elements.set("Drug_Name", (b[i].name));
 elements.set("Link", ("https://pharmeasy.in/online-medicine-order/"+b[i].slug));

// elements.set("Photo", (stringValue.body.results[0].hits[i].thumbnail_url));
 elements.set("Price", (b[i].mrpDecimal));
 elements.set("real_Price", (b[i].salePriceDecimal));

return(elements);
}
