var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_STRING = "mongodb+srv://yessicerlyn:d8QRPZPXCrytqVZN@webshop.d1v6zeo.mongodb.net/?retryWrites=true&w=majority&appName=webshop";

var DATABASENAME = "webshop";
var database;

app.listen(5038, () => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.error('Failed to connect to the database. Exiting now...', error);
            process.exit();
        }
        database = client.db(DATABASENAME);
        console.log("MongoDB Connection Successful");
    });
});

app.get('/webshop-back/app/GetProduct', (request, response) => {
    database.collection("product").find().toArray((error, result) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.send(result);
        }
    });
});

app.post('/webshop-back/app/AddProduct', multer().none(), (request, response) => {
    database.collection("product").countDocuments({}, (error, numOfDocs) => {
        if (error) {
            response.status(500).send(error);
        } else {
            const product = {
                id: numOfDocs + 1,
                name: request.body.name,
                desc: request.body.desc,
                price: parseFloat(request.body.price)
            };
            database.collection("product").insertOne(product, (err, res) => {
                if (err) {
                    response.status(500).send(err);
                } else {
                    response.json("Added Successfully");
                }
            });
        }
    });
});

app.delete('/webshop-back/app/DeleteProduct/', (request, response) => {
    database.collection("product").deleteOne({
        id: parseInt(request.query.id)
    }, (error, result) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.json("Deleted Successfully");
        }
    });
});
