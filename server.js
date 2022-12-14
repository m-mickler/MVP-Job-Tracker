import pg from "pg";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV === "production"
        ? {
            ssl: {
                rejectUnauthorized: false
            }
        }
        : {}),
});

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("static"));
app.use(express.json());

const errorHandler1 = (req, res, next) => {
    res.sendStatus(404);
    next();
};

//used to display the newly created user's ID
app.get("/api/users/new", (req, res, next) => {
    pool.query("SELECT * FROM users ORDER BY id DESC LIMIT 1;").then((data) => {
        res.send(data.rows);
    }).catch(next)
});

//used to get information about the current user and display about the kanban board
app.get("/api/users/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id = $1;", [id]).then((data) =>{
        if(data.rows[0]){
            res.send(data.rows[0]);
        } else {
            res.sendStatus(404);
        }   
    }).catch(next);
});

//used to find a users ID by their name if they forgot what their id is
app.get("/api/users/:first_name/:last_name", (req, res, next) => {
    const firstname = req.params.first_name;
    const lastname = req.params.last_name;
    pool.query("SELECT id FROM users WHERE (first_name = $1 and last_name = $2);", [firstname, lastname]).then((data) =>{
        if(data.rows[0]){
            res.send(data.rows[0]);
        } else {
            res.sendStatus(404);
        }   
    }).catch(next);
});

//gets all info from a user by their id
app.get("/api/tracker/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query("SELECT * FROM tracker WHERE id = $1;", [id]).then((data) =>{
        if(data.rows){
            res.send(data.rows);
        } else {
            res.sendStatus(404);
        }   
    }).catch(next);
});

// used to delete a company for a specific user
app.delete("/api/tracker/:id/:company", (req, res, next) => {
    const id = req.params.id;
    const company = req.params.company;
    console.log(id, company);
    pool.query("DELETE FROM tracker WHERE (id = $1 and company = $2) RETURNING *;", [id, company]).then((data) => {
        console.log(data.rows);
        if(data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(204).send(data.rows[0]);
        }
    }).catch(next)
});

// used to create a new user
app.post("/api/users", (req, res, next) => {
    const newUser = req.body;
    if(newUser.first_name && newUser.last_name){
        pool.query(`INSERT INTO users (first_name, last_name)
            VALUES ($1, $2) RETURNING *;`,
            [newUser.first_name, newUser.last_name]
        ).then((data) => {
            res.status(201).send(data.rows[0]);
        }).catch(next)
    } else {
        res.sendStatus(400);
    }
});

//used to create a new job
app.post("/api/tracker", (req, res, next) => {
    const newJob = req.body;
    if(newJob.company && newJob.applied && newJob.interview && newJob.TC_offer && newJob.id){
        pool.query(`INSERT INTO tracker (company, applied, interview, TC_offer, id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [newJob.company, newJob.applied, newJob.interview, newJob.TC_offer, newJob.id]
        ).then((data) => {
            res.status(201).send(data.rows[0]);
        }).catch(next)
    } else {
        res.sendStatus(400);
    }
});

//used to update any status of a job for a specific user
app.patch("/api/tracker/:id/:company", (req, res, next) => {
    const company = req.params.company;
    const id = req.params.id;
    const update = req.body;
    if(update.applied || update.interview || update.TC_offer) {
        pool.query(`UPDATE tracker
        SET applied = COALESCE($1, applied),  
            interview = COALESCE($2, interview),
            TC_offer = COALESCE($3, TC_offer) 
        WHERE (id = $4 and company = $5)
        RETURNING *;`, 
        [update.applied, update.interview, update.TC_offer, id, company]).then(data => {
            if(data.rows.length === 0){
                res.sendStatus(404);
            } else {    
            res.status(200).send(data.rows[0]); 
            }
        }).catch(next) 
    } else {
        res.sendStatus(400);
        }                                  
});

//********* BELOW NOT USED ***********
// app.get("/api/tracker", (req, res, next) => {
//     pool.query("SELECT * FROM tracker;").then((data) => {
//         res.send(data.rows);
//     }).catch(next);
// })

//********* BELOW NOT USED ***********
// app.delete("/api/users/:id", (req, res, next) => {
//     const id = req.params.id;
//     pool.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]).then((data) => {
//         if(data.rows.length === 0) {
//             res.sendStatus(404);
//         } else {
//             res.status(204).send(data.rows[0]);
//         }
//     }).catch(next)
// });


app.use(errorHandler1);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(`${PORT}`, () => {
    console.log(`listening on port ${PORT}`)
});