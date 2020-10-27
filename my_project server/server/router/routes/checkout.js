'use strict';

module.exports = (app, db) => {

  // GET all orders
  app.get('/orders/:userid', (req, res) => {
    const userid =req.params.userid; 
    db.checkout.findAll({ where: {user_id:userid}, include: [{model: db.products  , as: 'product'}],attributes:[
      'orderid','product_id','total','created_at','status'
    ]})
      .then(orders => {
        if(orders)
          {
            res.json({Status:1,data:orders});} else{
            res.json({Status:-1}); 
          }
      });
  });



    // POST user checkout
    app.post('/checkout', (req, res) => {
      var uuid = require('uuid');
      const userid = req.body.userid; 
      const orderid = uuid.v1(); 
      const items = req.body.items; 
      const total = req.body.total; 
      items.map((e)=>{
        db.checkout.create({
            user_id: userid,
            orderid: orderid,
            product_id: e.product_id,
            total:total
          })
          .then(data => {
          });
      })
            res.json({Status:1});
    });

     // PATCH single category
  app.patch('/checkout/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    db.checkout.find({
      where: { orderid: id }
    })
      .then(checkout => {
        return checkout.updateAttributes(updates);
      })
      .then(updatedcheckout => {
        res.json(updatedcheckout);
      });
  });

};