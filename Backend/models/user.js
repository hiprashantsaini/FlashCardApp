const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type:String,required:true,maxLength:[30,'Name should be less than 30 characters']},
  email: {type:String,required:true},
  password: {type:String,required:true}
});
const User=mongoose.model('User', userSchema);
module.exports = User;