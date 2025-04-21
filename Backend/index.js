const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');

const connectDb=mongoose.connect('mongodb://127.0.0.1:27017/FlashCard');

const app=express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const flashRoutes=require('./routes/flashCardRoute');
const userRoutes=require('./routes/userRoute');
app.use('/api/flashcards',flashRoutes);
app.use('/api/user',userRoutes);

connectDb.then(()=>{
    console.log("Database connected");
    app.listen(8080,(err)=>{
        console.log("server running at 8080");
    })
});