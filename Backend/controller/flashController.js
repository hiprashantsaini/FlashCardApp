const Flashcard = require("../models/flashcard");
const sm2 = require("../utils/sm2");

const addCard=async(req,res)=>{
    try {
        console.log("works :",req.body)
        const {front,back,userId}=req.body;//ques:1 ans :"One"
        const card=new Flashcard({
           userId,
           front,
           back,
        });

        const newCard=await card.save();
        res.status(201).json({status:"success",message:"Card added successfully",card:newCard});
    } catch (error) {
        res.status(500).json({status:"fail",message:"Failed to add card"});
    }
}

const getAllCards=async (req, res) => {
    const cards = await Flashcard.find({ userId: req.params.userId }).sort('nextReviewDate');
    res.json(cards);
  }

const reviewCard=async (req, res) => {
    const { cardId, score } = req.body;
    const card = await Flashcard.findById(cardId);
    const updated = sm2(card, score);
    await Flashcard.findByIdAndUpdate(cardId, updated);
    console.log("review works :",updated);
    res.json(updated);
  }

module.exports={
    addCard,
    getAllCards,
    reviewCard
}