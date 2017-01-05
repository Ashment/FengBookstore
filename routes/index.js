var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

var menuitems = require('../menuitems.json');

router.get('/', function(req, res){
  var curCartCount = 0;

  if(req.cookies.cartCookie != null){
    curCartCount = req.cookies.cartCookie.length;
  }

  res.render('hot', {
    title: '热饮',

    pageData : {
      cartCount : curCartCount
    }
    
  });
});

router.get('/tea', function(req, res){
  var curCartCount = 0;

  if(req.cookies.cartCookie != null){
    curCartCount = req.cookies.cartCookie.length;
  }

  res.render('tea', {
    title: '茶',

    pageData : {
      cartCount : curCartCount
    }
    
  });
});

router.get('/hot', function(req, res){
  var curCartCount = 0;

  if(req.cookies.cartCookie != null){
    curCartCount = req.cookies.cartCookie.length;
  }

  res.render('hot', {
    title: '热饮',

    pageData : {
      cartCount : curCartCount
    }
    
  });
});

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
  req.cookies.cartCookie = artemp;
  res.redirect('back');
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



//Test Reading JSON file
router.get('/jsoncheck', function(req,res){
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
router.get('/:num?', function(req,res){
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
router.get('/jsontest/write', function(req,res){
	res.cookie('iii', 789562);
	res.cookie('arr', [7,8,9,0]);
	res.redirect('back');
});

router.get('/jsontest/write/:num?', function(req,res){
	res.cookie('iii', req.params.num);
	res.redirect('back');
});

//Test Cookie Read
router.get('/jsontest/read', function(req,res){
	//res.send(req.cookies.iii + ' iii and arr ' + req.cookies.arr);
  res.send(req.cookies.cartCookie);
});

module.exports = router;

