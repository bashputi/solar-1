const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Client } = require('@vercel/postgres');
const secretKey = process.env.ACCESS_TOKEN_SECRET;
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

// GET /students for usestudents hook
app.get('/students', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE role = $1', ['student']);
      res.json({ message: 'Students are returned', data: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// GET /instructors for usestudents hook
app.get('/instructors', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE request IS NOT NULL;');
      res.json({ message: 'Instructors are returned', data: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// PATCH /users/bio/:id
app.patch('/users/bio/:id', async(req, res) => {
try {
   
    let { firstname, lastname, skill, phn, bio } = req.body;
    const { id } = req.params;
    const addColumnsQuery = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'skill') THEN
            ALTER TABLE users ADD COLUMN skill TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phn') THEN
            ALTER TABLE users ADD COLUMN phn TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
            ALTER TABLE users ADD COLUMN bio TEXT;
        END IF;
    END
    $$;
`;

await pool.query(addColumnsQuery);
const updateQuery = {
    text: `UPDATE users 
           SET firstname = $1, lastname = $2, 
               skill = COALESCE($3, skill), 
               phn = COALESCE($4, phn), 
               bio = COALESCE($5, bio)
           WHERE id = $6
           RETURNING *`,
    values: [firstname, lastname, skill, phn, bio, id],
};
const result = await pool.query(updateQuery);
if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
}
res.json(result.rows[0]);
} catch (error) {
    res.json({error: error.message});
}
});

//PATCH /users/profile
app.patch('/users/profile', async(req, res) => {
try {
    const {profileimage, email, coverimage} = req.body;
    console.log({profileimage, email, coverimage})
    const addColumnsQuery = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profileimage') THEN
            ALTER TABLE users ADD COLUMN profileimage TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'coverimage') THEN
            ALTER TABLE users ADD COLUMN coverimage TEXT;
        END IF;
    END
    $$;
`;
await pool.query(addColumnsQuery);
const updateQuery = {
    text: `UPDATE users 
           SET profileimage = COALESCE($1, profileimage),
           coverimage = COALESCE($2, coverimage)
           WHERE email = $3
           RETURNING *`,
    values: [profileimage, coverimage, email],
};
const result = await pool.query(updateQuery);
if (result.rowCount === 0) {
    return res.status(404).json({ error: "Update faild" });
}
res.json(result.rows[0]);

} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
});

//DELETE /coverphoto/:id 
app.delete('/users/coverphoto/:id', async(req, res) => {
    try {
        const { id } = req.params;
    const deleteQuery = 'UPDATE users SET coverimage = NULL WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({ message: 'Cover photo deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST //users/password/:id
app.post('/users/password/:id', async (req, res) => {
    try {
        const { password, newpassword } = req.body;
        const { id } = req.params;

        const results = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        const user = results.rows[0];

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)

        if (!isMatch) {
            res.status(201).json({ message: 'Current password is incorrect' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, id]);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /users/request/:id
app.patch('/users/request/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {request} = req.body
        console.log(id, request);
        const results = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        const user = results.rows[0];

        const addColumnsQuery = `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'request') THEN
                ALTER TABLE users ADD COLUMN request TEXT;
            END IF;
        END
        $$;
        `;
        await pool.query(addColumnsQuery);
        const updateQuery = {
        text: `UPDATE users 
            SET request = COALESCE($1, request)
            WHERE id = $2
            RETURNING *`,
        values: [request, id],
        };
        const result = await pool.query(updateQuery);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Update faild" });
        }
        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); 
    }
})

app.patch('/index/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const results = await pool.query('UPDATE users SET request = $1 WHERE id = $2 RETURNING *', [status, id]);
        if (results.rows.length === 0) {
            // No user found with the provided ID
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results.rows[0];
        console.log(user);
        res.status(200).json({ message: 'Status updated successfully', user });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});