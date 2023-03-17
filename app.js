const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const { Schema } = mongoose;

const items = [];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nadir:cHQ3cKSi7XvZDGvU@cluster0.ucb5a1n.mongodb.net/todolistdb");

const itemsSchema = new Schema({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);

/* todolist Items */

const item1 = new Item({ name: "Welcome to your to do list!" })

const item2 = new Item({ name: "Hit the + button to add a new item." })

const item3 = new Item({ name: "<--- Hit this to delete an item." })

const defaultItems = [item1, item2, item3];




app.get("/", function (req, res) {



    Item.find({})
        .then(function (foundItems) {

            console.log(foundItems);

            if (foundItems === 0) {
                Item.insertMany(foundItems)
                    .then(function () {
                        console.log("Successfully saved defult items to DB");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            } else {
                res.render("list", { listTitle: "Today", newListItems: foundItems });
            }

            res.redirect("/");
        })
        .catch(function (err) {
            console.log(err);

        });


});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;


    const item = new Item({ name: itemName });

    item.save();

    res.redirect("/");

})

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndDelete(checkedItemId)
        .then(function () {
            console.log("Successfully deleted item");
            res.redirect("/");
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work list", newListItems: workItems });
});

app.post("work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});