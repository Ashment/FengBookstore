var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

var fs = require('fs');
var orderQueue = require(__dirname + '/../orderQueue.json');

//var orderQfd = fs.openSync(path.join(__dirname + '/orderQueue.json'));

var saveTest = require(__dirname + '/../saveTest.json');
var menuitems = require(__dirname + '/../menuitems.json');


var orderQueueSize;


// _____   ____  _    _ _______ ______  _____ //
//|  __ \ / __ \| |  | |__   __|  ____|/ ____|//
//| |__) | |  | | |  | |  | |  | |__  | (___  //
//|  _  /| |  | | |  | |  | |  |  __|  \___ \ //
//| | \ \| |__| | |__| |  | |  | |____ ____) |//
//|_|  \_\\____/ \____/   |_|  |______|_____/ //
//                                            //

///////////////////////////////////////////////////////////////////////
///////////////////M E N U   P A G E   R O U T E S/////////////////////
///////////////////////////////////////////////////////////////////////

router.get('/', function(req, res){
  res.redirect('/tea');
  /*var curCartCount = 0;

  if(req.cookies.cartCookie != null){
    curCartCount = req.cookies.cartCookie.length;
  }

  res.render('index', {
    title: '咖啡',

    pageData : {
      cartCount : curCartCount
    }
    
  });*/
});

router.get('/coffee', function(req, res){
  itemPageRender(req, res, '咖啡', 100, 200);
});

router.get('/tea', function(req, res){
  itemPageRender(req, res, '茶', 200, 300);
});

router.get('/drinks', function(req, res){
  itemPageRender(req, res, '饮料', 300, 400);
});

router.get('/foods', function(req, res){
  itemPageRender(req, res, '食品', 400, 500);
});





///////////////////////////////////////////////////////////////////////
///////////////////////C A R T   R O U T E S///////////////////////////
///////////////////////////////////////////////////////////////////////

//Add To Cart (move each character right one key on keyboard)
router.get('/SffYpVsty/:idnum?', function(req,res){
  var cartTemp = [];
  if(req.cookies.cartCookie != null){
    cartTemp = req.cookies.cartCookie;
  }

  cartTemp.push(req.params.idnum);

  res.cookie('cartCookie', cartTemp);
  res.redirect('back');
});

//Remove From Cart (move each character right one key on keyboard)
router.get('/TrzpbrGtpzVsty/:indnum?', function(req,res){
  var cartTemp = [];
  if(req.cookies.cartCookie != null){
    cartTemp = req.cookies.cartCookie;
  }

  if(req.params.indnum < cartTemp.length){
    cartTemp.splice(req.params.indnum, 1);
  }

  res.cookie('cartCookie', cartTemp);
  res.redirect('back');
});

//Clear Cart (move each character right one key on keyboard)
router.get('/VarstVsty', function(req,res){
  var artemp = [];
  res.clearCookie('cartCookie');
  res.redirect('/cart');
});

//Go to Cart
router.get('/cart', function(req,res){
  cartTemp = [];

  if(req.cookies.cartCookie != null){
    cartTemp = req.cookies.cartCookie;
  }

  var jString = JSON.stringify(menuitems);
  var items = eval(jString);

  var enNamesArr = [];
  var cnNamesArr = [];
  var pricesArr = [];
  var imgDirsArr = [];

  for (var i=0; i<cartTemp.length; i++) {
    for(var x=0; x<items.length; x++){
      if(cartTemp[i].toString() == items[x].ID.toString()){
        enNamesArr.push(("" + items[x].nameEN));
        cnNamesArr.push(("" + items[x].nameCN));
        pricesArr.push(("" + items[x].price));
        imgDirsArr.push(("" + items[x].imgDir));
      }
    }
  }

  //DEBUG
  //res.send(enNamesArr);
  //res.send(cnNamesArr);
  //res.send(pricesArr);
  //res.send(imgDirsArr);
  
  res.render('cart', {
    title: 'Cart',

    pageData : {
      cartCount : cartTemp.length,
      cNamesAr : cnNamesArr,
      eNamesAr : enNamesArr,
      pricesAr : pricesArr,
      imgsAr : imgDirsArr
    }
  });
});





///////////////////////////////////////////////////////////////////////
///////////////////////O T H E R   R O U T E S/////////////////////////
///////////////////////////////////////////////////////////////////////

//Checkout (move each character right one key on keyboard)
router.get('/Vjrvlpiy', function(req,res){
  var curOrderQueue = orderQueue;

  //DEBUG
  //res.send(curOrderQueue);
  //

  if(req.cookies.cartCookie){
    cartTemp = [];

    if(req.cookies.cartCookie != null){
      cartTemp = req.cookies.cartCookie;
    }

    var jString = JSON.stringify(menuitems);
    var items = eval(jString);

    var cnNamesArr = [];
    var pricesArr = [];
    
    for (var i=0; i<cartTemp.length; i++) {
      for(var x=0; x<items.length; x++){
        if(cartTemp[i].toString() == items[x].ID.toString()){
          cnNamesArr.push(("" + items[x].nameCN));
          pricesArr.push(("" + items[x].price));
        }
      }
    }

    var orderObjTemp = {
      "nameArray" : cnNamesArr,
      "pricesArray" : pricesArr
    };

    curOrderQueue.OrderQArray.push(orderObjTemp);

    toWriteString = JSON.stringify(curOrderQueue);

    var fd = "";
    fd = __dirname + '/../orderQueue.json';

    fs.writeFileSync(fd, toWriteString);

  }else{
    res.send('Cart is empty.');
  }


    res.clearCookie('cartCookie');
    res.render('confirmation', {
      title: "下单成功"
    });

  //DEBUG
  //res.send("File Written?  =>" + toWriteString);
  //res.send(fd);
  //
});

router.get('/Barista/OrderDone/:indnum?', function(req,res){
  curOrderQueue = orderQueue;
  curOrderArray = curOrderQueue.OrderQArray;

  if(req.params.indnum < curOrderArray.length){
    curOrderArray.splice(req.params.indnum, 1);
  }

  toWriteString = JSON.stringify(curOrderQueue);

  var fd = "";
  fd = __dirname + '/../orderQueue.json';

  fs.writeFileSync(fd, toWriteString);

  res.redirect('/BaristaView');
});

router

router.get('/BaristaView', function(req,res){
  var curOrderQueue = orderQueue;

  res.render('baristaa', {
    title: 'BaristaView',

    pageData : {
      orderArray : curOrderQueue.OrderQArray
    }
  });
});


///////////////////////////////////////////////////////////////////////
/////////////////////D A T A   H A N D L I N G/////////////////////////
///////////////////////////////////////////////////////////////////////

//Test Reading JSON file
router.get('/test/jsoncheck', function(req,res){
	//res.send(JSON.stringify(menuitems.items.template.name + ' III ID ... Price III ' + menuitems.items.template.category));
  var jString = JSON.stringify(menuitems);
  var arrayofObjects = eval(jString);
  var checkString = "";
  var namesArr = [];
  for(var i=0; i<arrayofObjects.length; i++){
    namesArr.push(("" + arrayofObjects[i].ID));
  }

  res.send(namesArr);
});

//Testing Parsing URL HTTP Request
router.get('/test/:num?', function(req,res){
	if(req.params.num)
    {
		  res.send("Registered ID" + req.params.num);
    }
    else
    {
      res.send("No Register");
    }
});

//Test Cookie Write
router.get('/test/jsontest/writeDef', function(req,res){
	res.cookie('iii', 789562);
	res.cookie('arr', [7,8,9,0]);
	res.redirect('back');
});

router.get('/test/jsontest/write/:num?', function(req,res){
	res.cookie('iii', req.params.num);
	res.redirect('back');
});

//Test Cookie Read
router.get('/test/jsontest/read', function(req,res){
	//res.send(req.cookies.iii + ' iii and arr ' + req.cookies.arr);
  res.send(req.cookies.cartCookie);
});

module.exports = router;





// __  __ ______ _______ _    _  ____  _____   _____ //
//|  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|//
//| \  / | |__     | |  | |__| | |  | | |  | | (___  //
//| |\/| |  __|    | |  |  __  | |  | | |  | |\___ \ //
//| |  | | |____   | |  | |  | | |__| | |__| |____) |//
//|_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/ //
//                                                   //


function itemPageRender(reqObj, resObj, catName, minSID, maxSID){
  var curCartCount = 0;

  //Load cart cookie if it exists
  if(reqObj.cookies.cartCookie != null){
    curCartCount = reqObj.cookies.cartCookie.length;
  }

  //Search between given ID numbers
  //Coffee(100s); Tea(200s); Drinks(300s); Foods(400s)
  var reqItems = itemSearch(minSID, maxSID);

  var IDsArr = [];
  var enNamesArr = [];
  var cnNamesArr = [];
  var pricesArr = [];
  var imgDirsArr = [];

  //Push parameters to parameter arrays
  for (var i=0; i<reqItems.length; i++) {
    IDsArr.push(("" + reqItems[i].ID));
    enNamesArr.push(("" + reqItems[i].nameEN));
    cnNamesArr.push(("" + reqItems[i].nameCN));
    pricesArr.push(("" + reqItems[i].price));
    imgDirsArr.push(("" + reqItems[i].imgDir));
  }

  resObj.render('index', {
    title: catName,

    pageData : {
      cartCount : curCartCount,
      cNames: cnNamesArr,
      eNames: enNamesArr,
      prices: pricesArr,
      imgs: imgDirsArr,
      IDs: IDsArr
    }    
  });
}

function itemSearch(minID, maxID){
  var jString = JSON.stringify(menuitems);
  var itemss = eval(jString);

  var results = [];

  for(var i=0; i<itemss.length; i++){
    var ident = Number(itemss[i].ID.toString());
    if(ident > minID && ident < maxID){
      results.push(itemss[i]);
    }
  }
  return results;
}
