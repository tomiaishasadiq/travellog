const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelLogSchema = new Schema({
    title: { type:String, required: true },
    log: { type:String, required:true },
    visitedLocation: { type: [String], default: [] },
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    createdOn: { type: Date, default: Date.now},
    imageUrl: { type: [String], default: [] },
    coverImageUrl: { type: String },
    visitedDate: { type: Date, required:true},

    budget: {
        breakdown: [
          {
            category: { type: String, required: true },  // Category of expense (flights, food, etc.)
            amount: { type: Number, required: true },    // Amount spent in that category
            note: { type: String, default: "" },         // Additional notes (e.g., "purchased 1 month before")
          }
        ],
        visibility: { type: String, enum: ["public", "private"], default: "private" } // Public or private budget
      },
    
      // Optional season and weather information
      season: { type: String, enum: ["spring", "summer", "fall", "winter"]}, 
      weather: { type: String, default: "" }, // Weather description (e.g., "19°C, cloudy")
})

module.exports = mongoose.model("TravelLog", travelLogSchema);
