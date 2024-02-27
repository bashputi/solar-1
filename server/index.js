const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const pool = require("./db");
const app = express();
const PORT = 3001;

app.use(express.json());
app.listen(PORT, () =>{
    console.log(`Server is running at port:${PORT}`);
});
app.use(cors());
app.get('/', (req, res) => {
    res.send("hello");
});

// POST /register -> create a user
app.post("/users/register", async(req, res) => {
    try {
        let {firstname, lastname, username, email, password} = req.body;
        const id = uuidv4();
        console.log({
            firstname,
            lastname,
            username,
            email,
            password
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
                    `INSERT INTO users (id, firstname, lastname, username, email, password )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    returning *`, [id, firstname, lastname, username, email, hashedPassword],
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