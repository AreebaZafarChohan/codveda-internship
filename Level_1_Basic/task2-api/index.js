const express = require('express');
const app = express();
const cors = require("cors");

const PORT = 3000;

app.use(cors());

app.use(express.json()); // Middleware to parse JSON

// Sample in_memory data

let users = [
    { id: 1, name: "Areeba Zafar"},
    { id: 2, name: "Codveda User"},
    { id: 3, name: "Sara Chohan"},
    { id: 4, name: "Kainat Malik"},
    { id: 5, name: "Zamal Zihal"},
];

// GET all users
app.get("/users", (req, res) => {
    res.status(200).json(users);
});


// GET single user
app.get("/users/:id", (req, res) => {
   const user = users.find(u => u.id == req.params.id);
   if (user) res.status(200).json(user);
   else res.status(404).json({ error: "user not found"});
});

// POST a new user
app.post("/users", (req, res) => {
   const newUser = {
    id: users.length + 1,
    name: req.body.name
   };
   users.push(newUser);
   res.status(200).json(newUser)
});


// PUT (update) user
app.put("/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (user) {
        user.name = req.body.name;
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: "User not found"});
    }
});

// DELETE user
app.delete("/users/:id", (req, res) => {
   users = users.filter(u => u.id != req.params.id);
   res.status(200).json({ message: "User deleted successfully"});
});

app.listen( PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
