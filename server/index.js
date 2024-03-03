const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Client } = require('@vercel/postgres');


const pool = require("./db");
const app = express();
const PORT = 3001;

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Server is running at port:${PORT}`);
});

app.use(cors({
    origin: [
        'https://versed-yard.surge.sh',
        'http://localhost:5173'
    ],
    Credential: true
}));



const secretKey = process.env.ACCESS_TOKEN_SECRET;


app.get('/', (req, res) => {
    res.send("hello");
});

// POST /register -> create a user
app.post("/users/register", async(req, res) => {
    try {
        let {firstname, lastname, username, email, password, role} = req.body;
        const id = uuidv4();
        console.log({
            firstname,
            lastname,
            username,
            email,
            password,
            role
        })
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`,
            [email],
            (err, results) => {
                if(err){
                    throw err;
                }
                console.log(results.rows);
                if(results.rows.length > 0){
                    res.status(400).json({
                        status: 400,
                        message: "Email already used!!",
                      });
                      return;
                }else{
                pool.query(
                    `INSERT INTO users (id, firstname, lastname, username, email, password, role )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    returning *`, [id, firstname, lastname, username, email, hashedPassword, role],
                    (err, results) => {
                        if (err){
                            throw err;
                        }
                        if(results.rows.length > 0){
                            res.status(200).json({
                                status: 201,
                                success: true,
                                message: "User Created Successfully",
                              });
                        }

                    }
                )
                }
            }
        );


    
    } catch (error) {
        res.json({error: error.message});
    }
    });

// POST /login 
app.post("/users/login", async(req, res) => {
        try {
            let {email, password} = req.body;
            console.log({email, password});
            pool.query(
                `SELECT * FROM users
                WHERE email = $1`,
                [email],
                (err, results) => {
                    if(err){
                        throw err;
                    }
                    console.log(results.rows);
                    if(results.rows.length > 0){
                        console.log('user exist');

                    const user = results.rows[0];
                    console.log(user);

                   bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err){
                        console.log("pass not compared", err);
                    }
                    if(isMatch){
                        const token = jwt.sign(user , secretKey, { expiresIn: '1h' });
                         console.log(token)
                        console.log('matched')
                        res.status(200).json({
                            token ,
                            status: 201,
                            success: true,
                            message: "Logged in Successfully",
                          });

                    }else{
                        console.log('password is incorrect');
                        console.log('user not exist');
                        res.status(400).json({
                            status: 400,
                            message: "password is incorrect",
                          });
                          return;
                    }
                   })

                    }else{
                        console.log('user not exist');
                        res.status(400).json({
                            status: 400,
                            message: "Email does not exist!!",
                          });
                          return;
                    }
                });
            
        } catch (error) {
            res.json({error: error.message});
        }
    });

// POST /google login
app.post("/users/google", async(req, res) => {
    try {
        let { firstname, lastname, username, email, password, role } = req.body;
        console.log({ firstname, lastname, username, email, password, role});
        const id = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 10);
       
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    console.log('server error', err);
                    return res.status(500).json({ error: 'Server error occurred' });
                }
      
                if (results && results.rows.length > 0) {
                    const user = results.rows[0];
                    console.log(user)
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log("Error comparing password", err);
                            return res.status(500).json({ error: 'Server error occurred' });
                        }
                        if (isMatch) {
                            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
                            return res.status(200).json({
                                token,
                                status: 201,
                                success: true,
                                message: "Logged in Successfully",
                            });
                        } else {
                            return res.status(400).json({
                                status: 400,
                                message: "Email already used!!",
                            });
                        }
                    });
                } else {
                    pool.query(
                        `INSERT INTO users (id, firstname, lastname, username, email, password, role)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        returning *`, [id, firstname, lastname, username, email, hashedPassword, role],
                        (err, results) => {
                            if (err) {
                                console.log("Error inserting user", err);
                                return res.status(500).json({ error: 'Server error occurred' });
                            }
                            if (results.rows.length > 0) {
                                const user = results.rows[0];
                                console.log(user)
                                const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
                                return res.status(200).json({
                                    token,
                                    status: 201,
                                    success: true,
                                    message: "User Created Successfully",
                                });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error occurred' });
    }
});

// POST logout 
app.post("/users/logout", (req, res) => {
   try {
    res.status(200).json({
        status: 200,
        success: true,
        message: "Logout Successfully",
    });
   } catch (error) {
    res.status(500).json({ error: 'Server error occurred' });
   }
});

//GET /users
app.get('/users', async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users;")
        res.status(200).json({message: "users are returned", data: users.rows});
    } catch (error) {
        res.json({error: error.message}); 
    }
});

//GET /users/:id
app.get("/users/:id", async(req, res) => {
try {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.status(200).json({message: "Specific user is returned", data: users.rows });
} catch (error) {
    res.json({error: error.message});
}
});
  
 