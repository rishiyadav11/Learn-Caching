const express = require('express');
const port =3000
const { createClient } = require('redis');

const usermodel = require('./model/user.model')
const mongoose = require('mongoose');
const app = express();

app.use(express.json())
mongoose.connect("mongodb+srv://rishiyadav:rishiyadav@cluster0.5fcl30b.mongodb.net/chaching").then(()=>{
    console.log("mongodb connection established");
})


const client = createClient({
    password: 'HbA15apXdWonifIs2duCp4QjvwKhTEDS',
    socket: {
        host: 'redis-14087.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14087
    }
});

client.connect()

client.on('connect', () => {
    console.log('Connected to Redis');
});

app.get('/', (req, res) => {
    res.send("Hello World!");
})
app.post("/create",async(req,res)=>{
    const {name,email} = req.body;
    try {   
        const user = await usermodel.create({
            name,
            email,
        })
        res.json(user);
    } catch (error) {
        console.log("Error creating user");
        res.status(500).json({error: error.message});
    }
})

    app.get("/users/:id", async(req,res) => {
        const { id } = req.params;
        console.log(id);        
        //  await client.del(`user:profile:${id}`)
        try {
            const data = await client.get(`user:profile:${id}`);
            if (data) {
                return  res.json({
                    data:JSON.parse(data),
                    msg:"from cache storage"
                });
            }

            const user = await usermodel.findById(id)
            await client.setEx(`user:profile:${user.id}`,10,JSON.stringify(user))

            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({error: "User not found"})
            }
        } catch (error) {
            console.log("Internal error: " );
            res.status(500).json({error: error.message});
            
        }
    })

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
    
});