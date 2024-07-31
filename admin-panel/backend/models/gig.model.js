import mongoose from 'mongoose';
const { Schema } = mongoose;

const gigSchema = new Schema({
 userId :{
    type: String,
    required:true,
 },
 title:{
    type: String,
    required:true,
 },
 desc:{
    type: String,
    required:true,
 },
 totalStars:{
    type: Number,
    default :0,
 },
 starNumber:{
    type: Number,
    default:0,
 },
 cat:{
    type: String,
    required:true,
 },
 price:{
    type: Number,
    required:true,
 },
 cover:{
    type: String,
    required:true,
 },
 images:{
    type: [String],
    required:false,
 },
 features:{
    type: [String],
    required:false,
 },
 sales:{
    type:Number,
    default:0,
 }
},{
    timestamps:true
});

export default  mongoose.model("Gig",gigSchema)