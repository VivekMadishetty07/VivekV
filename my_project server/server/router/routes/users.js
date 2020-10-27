'use strict';

module.exports = (app, db) => {

  // GET all users
  app.get('/users', (req, res) => {
    db.users.findAll({ attributes: [
      'id','name','email','address','city','country'
   ],where:{role:"user"}})
      .then(users => {
        res.json(users);
      });
  });

  // GET one user by id
  app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    db.users.find({
      where: { id: id}
    })
      .then(user => {
        res.json(user);
      });
  });
  
  // POST user login
  app.post('/user/login', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password;
    console.log(req.body)
    db.users.find({
      where: { email: username,password:password}
    })
      .then(user => {
        console.log(user)
        if(user)
        {res.json({Status:1,data:user});} else{
          res.json({Status:-1}); 
        }
      });
  });

    // POST user login
    app.post('/user/products', (req, res) => {
      const userid = req.body.userid; 
      db.products.findAll({
        where: { user_id: userid}
      })
        .then(products => {
          if(products)
          {res.json({Status:1,data:products});} else{
            res.json({Status:-1}); 
          }
        });
    });
    
  // POST single user
  app.post('/user', (req, res) => {
    db.users.find({
      where: { email: req.body.email}
    })
      .then(user => {
       if(user){
        res.json({Status:-1});
       }else{
        db.users.create(req.body)
        .then(newuser => {
          res.json({Status:1,data:newuser});
        })
       }
      });

  });

  // PATCH single user
  app.patch('/user/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body.updates;
    db.users.find({
      where: { id: id }
    })
      .then(user => {
        return user.updateAttributes(updates)
      })
      .then(updateduser => {
        res.json(updateduser);
      });
  });

  // DELETE single user
  app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    db.users.destroy({
      where: { id: id }
    })
      .then(deleteduser => {
        res.json(deleteduser);
      });
  });
};