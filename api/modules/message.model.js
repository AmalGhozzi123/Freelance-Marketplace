import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
 conversationId :{
    type: String,
    required:true,
 },
 userId :{
    type: String,
    required:true,
 },
 desc :{
    type: String,
    required:true,
 },
 date:{
   type: Date, 
   default: Date.now, 
},
 
},{
    timestamps:true
});

export default  mongoose.model("Message",messageSchema)