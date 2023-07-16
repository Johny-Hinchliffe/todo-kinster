const PORT = process.env.PORT ?? 8000
const express = require("express")
const { v4: uuidv4 } = require('uuid')
const cors = require("cors")
const pool = require("./db.js")
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

//get all todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail} = req.params
  try {
    const todos = await pool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    )
    res.json(todos.rows)
  } catch (err) {
    console.error(err)
  }
})

//create a new todo

app.post('/todos', async (req,res) => {
  const {userEmail, title, progress, date} = req.body
  console.log(userEmail, title, progress, date)
  const id = uuidv4()
  try {
   const newTodo = await pool.query(
    `INSERT INTO todos(id, user_email, title, progress, date)
    VALUES($1, $2, $3, $4, $5)`, [id, userEmail, title, progress, date]
   )
   res.json(newTodo)
  

  } catch (err) {
    console.error(err)
  }
})

// edit a todo

app.put('/todos/:id', async (req,res) => {
  const {id} = req.params
  const {userEmail, title, progress, date} = req.body

  console.log(id, userEmail, title, progress, date)

  try {
   const editedTodo = await pool.query(
    `UPDATE todos SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id=$5`, [userEmail, title, progress, date, id]
   )

   console.log(editedTodo.rows)
   res.json(editedTodo)
  

  } catch (err) {
    console.error(err)
  }
})

// delete a todo

app.delete('/todos/:id', async (req,res) => {
  const {id} = req.params
  
  try {
   const deletedTodo = await pool.query(
    `DELETE FROM todos WHERE id=$1`, [id]
   )
   res.json(deletedTodo)
  } catch (err) {
    console.error(err)
  }
})

//signup 

app.post('/signup', async (req,res) => {
  const {email, password} = req.body


  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password,salt)

  try {
   const signedUp = await pool.query(
    `INSERT INTO users(email, hashed_password)
    VALUES($1, $2)`, [email, hashedPassword]
   )
   const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

   res.json({email, token})
  

  } catch (err) {
    if(err){
    res.json({detail: err.detail})
    }
  }
})


//login

app.post('/login', async (req,res) => {
  const {email, password} = req.body

  try {
   const users = await pool.query(
    `SELECT * FROM users WHERE email=$1`, [email]
   )
   if(!users.rows.length) return res.json({detail: 'User does not exists'})
 
 const success = await bcrypt.compare(password, users.rows[0].hashed_password)
 const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

if(success){
    res.json({'email':users.rows[0].email, token})
  } else res.json({detail: 'Password is incorrect'})

  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, () => `Server running on PORT ${PORT}`)
