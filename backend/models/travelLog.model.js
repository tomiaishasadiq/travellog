const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelLogSchema = new Schema({
    title: { type:String, required: true },
    log: { type:String, required:true },
    visitedLocation: { type: [String], default: [] },
    placesVisited:{ type: [String], default: [] },
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    createdOn: { type: Date, default: Date.now},
    imageUrl: { type: [String], default: [] },
    visitedDate: { type: Date, required:true},
    tags: { type: [String], default: [] }, 
})

module.exports = mongoose.model("TravelLog", travelLogSchema);
