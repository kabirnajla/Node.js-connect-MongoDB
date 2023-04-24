const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(express.static(__dirname+ '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { MongoClient } = require('mongodb')
const { query } = require('express')
const url = 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url)

const dbName = 'webphuket'
const MongoObjectID = require('mongodb').ObjectId

// app.get('/', (req, res) =>  {
//     res.send('<h1> Hello World!</h1>')
// })

app.get('/insert',  (req, res) => {
    res.render('insert')
})

app.post('/insert', async (req, res) => {
    // console.log(req.body.fname)
    // console.log(req.body.lname)

    // res.send('ok')

    await client.connect()
    const collection = client.db(dbName).collection('users');

    var data = {
        fname : req.body.fname,
        lname : req.body.lname,
        email : req.body.email,
        gender : req.body.gender,
    }

    await collection.insertOne(data);
    await client.close()

    res.redirect('/')
})

app.get('/', async(req, res) => {
    await client.connect();
    const collection = client.db(dbName).collection('users');

    const findResult = await collection.find({}).toArray();
    res.render('list', {data: findResult} )

    // console.log(findResult)

    await client.close()
})

// app.get('/delete/:_id', async(req, res) => {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection('users');

//     data = {_id: new MongoObjectID(req.params._id)}
//     await collection.deleteOne(data);

//     await client.close()
//     res.redirect('/')
// })

app.get('/delete/:_id',async(req,res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    data = { _id : new MongoObjectID(req.params._id) }
    await collection.deleteOne(data);

    await client.close()
    res.redirect('/')
})

app.get('/update/:_id', async(req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    const findResult = await collection.find({_id : new MongoObjectID(req.params._id)}).toArray();
    
    if (findResult[0].gender == "M"){
        genderM = "checked"
        genderF = ""
    }else {
        genderM = ""
        genderF = "checked"
    }

    data = {
        _id : findResult[0]._id,
        fname : findResult[0].fname,
        lname : findResult[0].lname,
        email : findResult[0].email,
        gender :findResult[0].gender,
        genderM : genderM,
        genderF : genderF,
    }

    res.render('update',data)
    await client.close()
}) 

app.post('/update', async(req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    var query = {_id : new MongoObjectID(req.body._id) }
    var data = { $set : { 
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        gender : req.body.gender,
    }}

    await collection.updateOne(query,data);
    await client.close()

    res.redirect('/')
})

app.listen(3000,() => {
    console.log('Server Started on localhost: 3000........')
})


// INSERT INTO users VALUES (NULL, "2", "2")

// SELECT * FROM users WHERE id = 1

// UPDATE users SET id = 3
// WHERE id = 5;

// DELETE FROM users WHERE fname='Ka'

