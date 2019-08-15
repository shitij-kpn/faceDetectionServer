const bodyParser = require('body-parser');

const express = require('express');

const bcrypt = require('bcrypt-nodejs');

const cors  = require('cors');

const knex = require('knex');

const postgres = knex({
    client:'pg',
    connection: {
        host: 'postgresql-slippery-98464',
        user : 'postgres',
        password :'hellohigh',
        database : 'smart_brain',
    }
});


const app = express();

app.use(bodyParser.json());

app.use(cors());


//On GET request
app.get('/' , (req,res) => {
    res.send("it is working");
})

//SignIN
app.post('/signin' , (req , res) => {
    const {email , password} = req.body;
    postgres.select('email','hash').from('login')
        .where('email','=',email)
        .then(data => {
            const isValid = bcrypt.compareSync(password,data[0].hash);
            if(isValid){
                return postgres.select('*').from('users')
                        .where('email','=',email)
                        .then(user => {
                             res.json(user[0])
                        })
                        .catch(err => res.status(400).json('unable to get user'))
            }     
            else{
                res.json('wrong credentials').status(400)
            }       
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

//register
app.post('/register',(req,res)=>{
    const {email , name , password} = req.body;
    const hash = bcrypt.hashSync(password);
    postgres.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email : loginEmail[0],
                    name : name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        .catch(err => res.json('unable to register'))
    
})

//profile
app.get('/profile/:id' , (req,res) => {
    const { id } = (req.params);
    postgres.select('*').where({id : id}).from('users')
        .then(user => {
            if(user.length){
                res.json(user[0]);
            }
            else{
                res.status(400).json('not found');
            }
        })
})

app.put('/image' , (req,res) => {
    const { id } = (req.body);
    postgres('users')
        .where('id', '=', id)
        .increment('entries',1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
})


//starts the server
app.listen(process.env.PORT || 5000, () => {
    console.log('app is running');
})
