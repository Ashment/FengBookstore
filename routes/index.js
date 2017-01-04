var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

var menuitems = require('../menuitems.json');

var cart = [];

router.get('/', function(req, res){
  res.render('hot', {
    title: '热饮',

    pageData : {
      cartCount : cart.length
    }
    
  });
});

router.get('/tea', function(req, res){
  res.render('tea', {
    title: '茶',

    pageData : {
      cartCount : cart.length
    }
    
  });
});

router.get('/hot', function(req, res){
  res.render('hot', {
    title: '热饮',

    pageData : {
      cartCount : cart.length
    }
    
  });
});

router.get('/addtocart/:idnum?', function(req,res){
  cart.push(req.params.idnum);
  res.redirect('back');
});

router.get('/clearcart', function(req,res){
  var artemp = [];
  cart = artemp;
  res.redirect('back');
});

router.get('/cart', function(req,res){
  res.send(cart);
});




//Test Reading JSON file
router.get('/jsoncheck', function(req,res){
	res.send(JSON.stringify(menuitems.template.ID + ' <ID ... Price> ' + menuitems.template.price));
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
	res.send(req.cookies.iii + ' iii and arr ' + req.cookies.arr);
});

module.exports = router;

