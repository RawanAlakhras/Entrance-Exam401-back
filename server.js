const express = require('express') // require the express package
const app = express() // initialize your express app instance
const cors = require('cors');
app.use(cors()); // after you initialize your express app instance
require('dotenv').config();
const axios = require('axios'); // require the package
app.use(express.json());
const PORT=3010;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
const drinkSchema = new mongoose.Schema({
    strDrinkThumb: String,
    strDrink:String,
  });

const drinkModel = mongoose.model('drink', drinkSchema);

/* function addFav(req,res){
    const {strDrinkThumb,strDrink}=req.body;
    console.log(req.body);
} */
 


// a server endpoint 
app.get('/getFav',function(req,res){
    drinkModel.find({},(error,data)=>{
        res.send(data);
    })

})
app.get('/', // our endpoint name
 function (req, res) { // callback function of what we should do with our request
  res.send('Hello World') // our endpoint function response
})
app.put('/addFav', function (req,res){
    const {strDrinkThumb,strDrink}=req.body;
    //console.log(req.body);
    
    const newObj=new drinkModel({
        strDrinkThumb:strDrinkThumb,
        strDrink:strDrink,
    })
    //console.log( newObj)
    newObj.save(); 
    
});
app.put('/updateFav', function (req,res) {
    //console.log(req.body);
    const {strDrinkThumb,strDrink,id}=req.body;
    drinkModel.find({_id:id}, (error, data)=>{
        
        data[0].strDrinkThumb=strDrinkThumb;
        data[0].strDrink=strDrink;
        data[0].save().then( drinkModel.find({},(error,alldata)=>{
            res.send(alldata);
        }))
       
    })


})
app.get('/getDrink',getDrink);

app.delete('/deleteFav',function (req,res){
    const id =req.query.id;
    console.log(req.query.id);
    drinkModel.findByIdAndDelete({_id:id} ,(error,data)=>{
        
    })
    drinkModel.find({},(error,data)=>{
        res.send(data);
    })
    
})

//function 


app.listen(PORT) // kick start the express server to work

function getDrink(req,res){
    const url ='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    axios.get(url).then(data=>{
        res.send(data.data.drinks);
    }).catch(error => console.log(error));

}