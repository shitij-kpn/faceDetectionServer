const express = require('express');

const bodyParser = require('body-parser');

const cors  = require('cors');



const app = express();

app.use(bodyParser.json());

app.use(cors());

const database = {
    users : [
        {
            id : 123,
            name : 'john',
            email : 'john@gmail.com',
            password : 'cookies',
            entries : 0,
            joined : new Date()
        },
        {
            id : 124,
            name : 'sally',
            email : 'sally@gmail.com',
            password : 'bananas',
            entries : 0,
            joined : new Date()
        }
    ]
}

//On GET request
app.get('/' , (req,res) => {
    res.send(database.users);
})

//SignIN
app.post('/signin' , (req , res) => {
    if(req.body.email == database.users[0].email
        &&req.body.password == database.users[0].password)
        res.json(database.users[0]);
    else{  
        res.status(400).json('error');
    }
})

//register
app.post('/register',(req,res)=>{
    const {email , name , password} = req.body;
    database.users.push({
        id : 12345,
        name : name,
        email : email,
        password : password,
        entries : 0,
        joined : new Date()
    });
    res.json(database.users[database.users.length -1]);
})

//profile
app.get('/profile/:id' , (req,res) => {
    const { id } = (req.params);
    id = number(id);
    console.log(id);
    let found = false;
    database.users.forEach(user => {
        if(id === user.id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.json("user not found");
    }
})

app.put('/image' , (req,res) => {
    const { id } = (req.body);
    console.log(id);
    let found = false;
    database.users.forEach(user => {
        if(id == user.id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){
        res.json("user not found");
    }
})


//starts the server
app.listen(5000, () => {
    console.log('app is running');
})
