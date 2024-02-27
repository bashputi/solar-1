const express = require("express");

const pool = require("./db");
const app = express();
const PORT = 3001;

app.use(express.json());
app.listen(PORT, () =>{
    console.log(`Server is running at port:${PORT}`);
});

// POST /register -> create a user
app.post("/books", async(req, res) => {
    try {
        const {name, description} = req.body;
        const id = uuidv4();

        // inserting book data into database
       const newBook = await pool.query("INSERT INTO book (id, name, description) VALUES ($1, $2, $3) RETURNING *", [id, name, description])

        res.status(201).json({message: `book is created`, data: newBook.rows[0] });
    } catch (error) {
        res.json({error: error.message});
    }
    });