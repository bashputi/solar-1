const express = require("express");
const bcrypt = require("bcrypt");
const http = require("http");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { Client } = require('@vercel/postgres');
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            'https://versed-yard.surge.sh',
            'http://localhost:5173'
        ],
        credentials: true 
    }
});

io.on("connect", (socket) => {
    console.log(`Socket Connected`, socket.id);

    socket.on('join-room', (roomId, id) => {
    console.log(`new user ${id} has joined the room ${roomId}`)
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', id)
    });

    socket.on("disconnect", () => {
        console.log(`Socket Disconnected`, socket.id);
    });
});

app.use(express.json());
app.use(cors());

httpServer.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`);
});

app.get('/', (req, res) => {
    res.send("hello");
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rimeislam672@gmail.com',
        pass: 'unop cgid uawx fgbo'
    }
});

//Generate OTP
const generateOTP = () => {
    const digits = '0123456789';
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
//send OTP via Email
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: 'rimeislam672@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully')
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// POST /register -> create a user
app.post("/users/register", async(req, res) => {
    try {
        let {firstname, lastname, username, email, password, role} = req.body;
        const id = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email],
            (err, results) => {
                if(err){
                    throw err;
                }
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
app.patch("/users/login", async(req, res) => {
        try {
            let {email, password} = req.body;
            console.log({email, password})
            pool.query(`SELECT * FROM users WHERE email = $1`,[email],
                async(err, results) => {
                    if(err){throw err; }
                    if(results.rows.length > 0){
                    const user = results.rows[0];

                   bcrypt.compare(password, user.password, async(err, isMatch) => {
                    if(err){
                        console.log("pass not compared", err);
                    }
                    if(isMatch){
                        const otp = generateOTP();
                        console.log(otp)
                        const addColumnsQuery = `
                        DO $$
                        BEGIN
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'otp') THEN
                                ALTER TABLE users ADD COLUMN otp TEXT;
                            END IF;
                        END
                        $$;
                    `;
                    await pool.query(addColumnsQuery);
                    const updateQuery = {
                        text: `UPDATE users 
                               SET otp = COALESCE($1, otp)
                               WHERE email = $2
                               RETURNING *`,
                        values: [otp, email],
                    };
                    const result = await pool.query(updateQuery);
                    if (result.rows.length > 0) {
                        await sendOTP(email, otp);
                       res.status(200).json({
                            status: 201,
                            success: true,
                            message: "Verify OTP for Vrification",
                          });
                          return 
                    }
                 }else{
                        res.status(400).json({status: 400,message: "password is incorrect" });
                      return;
                    }
                   })
                    }else{res.status(400).json({status: 400,
                            message: "Email does not exist!!",});
                          return;
                    }
                });
            
        } catch (error) {
            res.json({error: error.message});
        }
});

//Verify OTP route
app.post('/users/verify-otp', async(req, res) => {
    try {
        const { email, otp } = req.body;
        console.log({ email, otp } )
        pool.query("SELECT * FROM users WHERE email = $1 AND otp = $2", [email, otp], async (err, results) => {
          if (err) {
            throw err;
          }
          if (results.rows.length > 0) {
            const user = results.rows[0];
            console.log(user)
            const token = jwt.sign(user , secretKey, { expiresIn: '1h' });
            res.status(200).json({ token, success: true, message: "Logged in Successfully" });
          } else {
            res.status(400).json({ status: 400, message: "OTP verification failed" });
          }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /google login
app.post("/users/google", async(req, res) => {
    try {
        let { firstname, lastname, username, email, password, role } = req.body;
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
                    bcrypt.compare(password, user.password, async(err, isMatch) => {
                        if (err) {
                            console.log("Error comparing password", err);
                            return res.status(500).json({ error: 'Server error occurred' });
                        }
                        if (isMatch) {
                            const otp = generateOTP();
                    console.log(otp)
                            
                const updateQuery = {
                    text: `UPDATE users 
                           SET otp = COALESCE($1, otp)
                           WHERE email = $2
                           RETURNING *`,
                    values: [otp, email],
                };
                const result = await pool.query(updateQuery);
                if (result.rows.length > 0) {
                    await sendOTP(email, otp);
                   res.status(200).json({
                        status: 201,
                        success: true,
                        message: "Verify OTP for Vrification",
                      });
                      return 
                }

                        } else {
                            return res.status(400).json({
                                status: 400,
                                message: "Email already used!!",
                            });
                        }
                    });
                } else {
                    const otp = generateOTP();
                    console.log(otp)
                    pool.query(
                        `INSERT INTO users (id, firstname, lastname, username, email, password, role, otp)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        returning *`, [id, firstname, lastname, username, email, hashedPassword, role, otp],
                        async(err, results) => {
                            if (err) {
                                console.log("Error inserting user", err);
                                return res.status(500).json({ error: 'Server error occurred' });
                            }
                            if (results.rows.length > 0) {
                                const user = results.rows[0];
                                console.log(user.email)
                                await sendOTP(user.email, otp);
                               res.status(200).json({
                                    status: 201,
                                    success: true,
                                    message: "Verify OTP for Vrification",
                                  });
                                  return 
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
        const {request} = req.body;
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
        text: `UPDATE users SET request = COALESCE($1, request)
            WHERE id = $2 RETURNING *`, values: [request, id],};

        const result = await pool.query(updateQuery);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Update faild" });
        }
        res.status(200);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); 
    }
});

//PATCH for approving instructor request
app.patch('/index/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const results = await pool.query('UPDATE users SET request = $1, role = $2 WHERE id = $3 RETURNING *', [status, 'instructor' ,id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /addcourse to add course
app.post('/addcourse', async (req, res) => {
    try {
        const { name, category, duration, details } = req.body;
        const id = uuidv4();
        console.log({ name, category, duration, details });
        
        pool.query('INSERT INTO course (id, name, category, duration, details) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, name, category, duration, details],
        (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(201).json({ message: 'Failed to add course' });
            } else {
                console.log('Inserted course:', result.rows[0]);
                return res.status(200).json({ message: 'Course added successfully', course: result.rows[0] });
            }
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//GET /allcourse
app.get('/allcourse', async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM course;")
        res.status(200).json({message: "Course are returned", data: users.rows});
    } catch (error) {
        res.json({error: error.message}); 
    }
});

//PATCH for approving instructor request
app.patch('/allcourse/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const addColumnsQuery = `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'request') THEN
                ALTER TABLE course ADD COLUMN request TEXT;
            END IF;
        END
        $$;
        `;
        await pool.query(addColumnsQuery);
        const updateQuery = {
        text: `UPDATE course 
            SET request = COALESCE($1, request)
            WHERE id = $2
            RETURNING *`,
        values: [status, id],
        };
        const result = await pool.query(updateQuery);
        if (result.rowCount === 0) {
            return res.status(201).json({ message: "Update faild" });
        }
        res.json({ message: "Update successful!!" });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//PATCH /time/:id instructor schedule
app.post('/time/:id', async (req, res) => {
    const { id: instructorId } = req.params;
    const scheduleData = req.body.map(entry => ({
        ...entry,
        id: uuidv4(),
        instructorId: instructorId,
        email: ''
    }));

    async function saveScheduleEntries(entries) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); 
            for (const entry of entries) {
                const { id, instructorId, day, date, time, email } = entry;
                const query = {
                    text: 'INSERT INTO schedule (id, instructorId, day, date, time, email) VALUES ($1, $2, $3, $4, $5, $6)',
                    values: [id, instructorId, day, date, time, email]
                };
                await client.query(query);
            }
            await client.query('COMMIT'); 
        } catch (error) {
            await client.query('ROLLBACK'); 
            throw error; 
        } finally {
            client.release(); 
        }
    }
    try {
        await saveScheduleEntries(scheduleData);
        res.status(200).json({ message: 'Schedule data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//DELETE /schedule/:id
app.delete('/schedule/:id', async (req, res) => {
    try {
        const { id: instructorId } = req.params;
        const deleteQuery = 'DELETE FROM schedule WHERE instructorId = $1';
        const result = await pool.query(deleteQuery, [instructorId]);
      
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No schedule entries found for the provided instructor ID.' });
        }
        res.status(200).json({ message: 'Schedule entries deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//GET /allcourse
app.get('/allschedule', async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM schedule;")
        res.status(200).json({message: "Schedule are returned", data: users.rows});
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
});

//PATCH /booked/:id
app.patch('/booked/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        console.log(id, email);
        pool.query(
            `SELECT * FROM schedule WHERE id = $1`,
            [id],
            async (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length > 0) {
                    const user = results.rows[0];
                    console.log(user);
    
                    pool.query(
                        `UPDATE schedule SET email = $1 WHERE id = $2`,
                        [email, id],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            const mail = {
                                from: 'rimeislam672@gmail.com',
                                to: email,
                                subject: 'OTP Verification',
                                text: `Your class on Solar has been booked for ${user.date} at ${user.time}`
                            };
                            
                            transporter.sendMail(mail, (error, info) => {
                                if (error) {
                                    console.error('Error occurred while sending email:', error);
                                } else {
                                    console.log('Email sent successfully:', info.response);
                                }
                            });
                    
                            res.status(200).json({ message: 'Email updated successfully' });
                        }
                    );
                } else {
                    res.status(404).json({ error: 'Schedule not found' });
                }
            }
        )
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


