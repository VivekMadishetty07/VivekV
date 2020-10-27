'use strict';
const env = require('../../config/env');
module.exports = (app, db) => {
  // GET all products
  app.get('/products', (req, res) => {
    db.products.findAll({ attributes: [
      'product_id','name','price','url','category'
   ]})
      .then(products => {
        if(products)
          {
            res.json({Status:1,data:products});} else{
            res.json({Status:-1}); 
          }
      });
  });

  // GET all products
  app.get('/categories', (req, res) => {
    db.products.aggregate('category', 'DISTINCT', { plain: false })
    .map(function (row) { return row.DISTINCT })
      .then(categories => {
      const promises =categories.map((e)=>{
        return db.products.findAll({
            where: { category: e}
          })
            .then(productslist => {
              return {"Category":e,"Products":productslist}
            });
        })
        Promise.all(promises).then(function(results) {
          res.json(results);
      })
        
      });
  });
  // GET one products by id
  app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    db.products.find({
      where: { id: id}
    })
      .then(products => {
        if(products)
          {
            res.json({Status:1,data:products});} else{
            res.json({Status:-1}); 
          }
      });
  });

  // POST single products
  app.post('/products', (req, res) => {
    var path = require('path');
    var fs = require('fs');
    const name = req.body.name;
    const category = req.body.cat;
    const price = req.body.price;
    let imagename;
    if(req.body.image!=null){
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < charactersLength; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      imagename=env.FILEPATH+result+"."+req.body.image.fileExtension;
      var buf = Buffer(req.body.image.value, 'base64');

     path='./images/'+result+'.'+req.body.image.fileExtension;
     fs.writeFile(path, buf, { flag: 'w' }, function(err) {
         if (err) 
             return console.error(err); 
     });
    }
    db.products.create({
      name: name,
      category: category,
      price:price,
      url:imagename
    })
      .then(newproducts => {
      // res.json(newproducts);
      res.json({ Status: 1,product:newproducts});
    });
  });

  // PATCH single products
  app.patch('/products/:id', (req, res) => {
    const id = req.params.id;
    req.body.category=req.body.cat;
    delete req.body.cat;
    const updates = req.body;
    db.products.find({
      where: { product_id: id }
    })
      .then(products => {
        return products.updateAttributes(updates);
      })
      .then(updatedproducts => {
        res.json(updatedproducts);
      });
  });

  app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    db.products.destroy({
      where: { product_id: id }
    })
      .then(deletedproducts => {
        if(deletedproducts){
          res.json({Status:1});} else{
            res.json({Status:-1}); 
        }
      });
  });

};