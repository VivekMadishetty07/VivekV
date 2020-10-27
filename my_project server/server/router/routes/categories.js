'use strict';

module.exports = (app, db) => {

  // GET all categories
  app.get('/all_categories', (req, res) => {
    db.categories.findAll({ attributes: [
        'name','id'
     ]})
      .then(categories => {
        res.json(categories);
      });
  });

   // POST single category
   app.post('/add_category', (req, res) => {
    db.categories.find({
      where: { name: req.body.category}
    })
      .then(categories => {
       if(categories){
        res.json({Status:-1});
       }else{
        db.categories.create({name:req.body.category})
        .then(newcategories => {
          res.json({Status:1,data:newcategories});
        })
       }
      });

  });

  
  // PATCH single category
  app.patch('/category/:id', (req, res) => {
    const id = req.params.id;
    req.body.name=req.body.category;
    delete req.body.category;
    const updates = req.body;
    db.categories.find({
      where: { id: id }
    })
      .then(category => {
        return category.updateAttributes(updates);
      })
      .then(updatedcategory => {
        res.json(updatedcategory);
      });
  });
};