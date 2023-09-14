

const express = require('express');
const mongodb = require('mongodb');
const app = express();
app.use(express.static('public'))

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://<name>:<password>.hqwsvaj.mongodb.net/?retryWrites=true&w=majority";
let db;

mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.error(err);
    return;
  }
  
  db = client.db("test"); // Specify your database name here
  
  app.listen(5000, () => {
    console.log('Server is listening on port 5000');
  });
});
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  db.collection('items').find().toArray(function(err, items) {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while fetching items.');
    }

  

    res.send( ` <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  
      </head>
      <body>
        <div class="container">
          <h1 class="display-6 text-center py-1">To do App</h1>
  
          <div class="jumbotron p-3 shadow-sm">
            <form action="/create-item" method="POST">
              <div class="d-flex align-items-center">
                <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
  
          <ul class="list-group pb-5">
          ${items.map(function(item){
           return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span class="item-text">${item.text}</span>
              <div>
                <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
              </div>
            </li>`
          }).join('')}
  
          </ul>
  
        </div>
  
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="browser.js"></script>
      </body>
      </html>`);
  });
});

app.post('/create-item', function (req, res) {
  db.collection('items').insertOne({ text: req.body.item }, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while adding the item.');
    }
    res.redirect('/')
  });
});

app.post('/update-item',function(req,res){
  //console.log(req.body.text)
  db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectID(req.body.id)},{$set:{text:req.body.text}},function(){
    res.send("data updated")
})
})

app.post('/delete-item',function(req,res){
  db.collection('items').deleteOne({_id:new mongodb.ObjectID(req.body.id)},function(){
    res.send("data deleted")
  })
  
})


