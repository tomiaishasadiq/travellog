//start building node.js and express server
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const express = require("express"); // an instance of the express server/framework
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const {authenticateToken} = require("./utilities");

const User = require("./models/user.model");
const TravelLog = require("./models/travelLog.model");

mongoose.connect(config.connectionString);
const port = process.env.PORT || 8000;
const app = express();//allow us to make api request and initialise our server
app.use(express.json()); //to be able to access the body being parsed directly in express
app.use(cors({origin: "*"}));//whitelist api so the connection works, able to make api request that exists in my computer from a react app that is also running on my computer


//Create Account
app.post("/create-account", async(req,res) => {
    const {userName, email, password, bio, following, followers, savedPosts, likedPosts} = req.body;

    if(!userName|| !email || !password){
        return res
        .status(400)
        .json({error: true, message: "All fields are required."});
    }

    const isUser = await User.findOne({ email });
    if(isUser){
        return res.status(400).json({error: true, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    // Create new user object
    const user = new User({
        userName,
        email,
        password: hashedPassword,
        bio: bio || "",
        following: following || [],
        followers: followers || [],
        savedPosts: savedPosts || [],
        likedPosts: likedPosts || []
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h"}
    );

    //Success message
    return res.status(201).json({
        error: false,
        user: { userName: user.userName,
            email: user.email,
            bio: user.bio,
            following: user.following,
            followers: user.followers,
            savedPosts: user.savedPosts,
            likedPosts: user.likedPosts, },
        accessToken,
        message: "Registration Successful",
    });
})

//Login
app.post("/login", async(req,res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Email and Password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User Not Found"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid Credentials"});
    }

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h",}
    );

    return res.json({
        error: false,
        message: "Login Successful",
        user: {userName: user.userName, email: user.email},
        accessToken
    })
});

//Get User
app.get("/get-user", authenticateToken, async(req,res) => {
   // Get userId from the authenticated user object
   const { userId } = req.user;

   // Find user by userId
   const user = await User.findOne({ _id: userId });

   if (!user) {
       return res.sendStatus(401); // If user doesn't exist, return 401 Unauthorized
   }

   return res.json({
        user: {
            user: user,
            message: "",
        },
        message: "",
    });

});

//Add Travel Log
app.post("/add-travel-log", authenticateToken, async(req,res) => {
    const { 
        title, 
        log, 
        visitedLocation, 
        placesVisited,
        imageUrl,  
        visitedDate, 
        tags 
    } = req.body;
    
    const { userId } = req.user;

    // Validate required fields
    if(!title || !log || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({ error: true, message: "All fields are required"});
    }

    // Converting visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
      
        const travelLog = new TravelLog({
            title, 
            log, 
            visitedLocation, 
            userId,
            imageUrl,  // An array of image URLs
            visitedDate: parsedVisitedDate, 
            placesVisited: placesVisited || [], // Default to an empty array if not provided
            tags: tags || [],
        });

        await travelLog.save();
        res.status(201).json({ log: travelLog, message: 'Travel Log Added Successfully' });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});


//Get All Travel Logs
app.get("/get-all-logs", authenticateToken, async(req,res) => {
   const { userId } = req.user;

   try{
    const travelLogs = await TravelLog.find({ userId: userId }).sort({
        isFavourite: -1
    });
    res.status(200).json({ logs: travelLogs });
   }catch(error){
    res.status(500).json({ error: true, message: error.message});
   }

});

//Edit Travel Log
app.put("/edit-log/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, log, visitedLocation, imageUrl, visitedDate, placesVisited, tags } = req.body;
    const { userId } = req.user;

    if (!title || !log || !visitedLocation || !visitedDate) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
      const travelLog = await TravelLog.findOne({ _id: id, userId: userId });
      if (!travelLog) {
        return res.status(404).json({ error: true, message: "Travel log not found" });
      }

      travelLog.title = title;
      travelLog.log = log;
      travelLog.visitedLocation = visitedLocation;
      travelLog.visitedDate = parsedVisitedDate;

      if (imageUrl && Array.isArray(imageUrl)) {
        travelLog.imageUrl = imageUrl;
      }

      if (placesVisited && Array.isArray(placesVisited)) {
        travelLog.placesVisited = placesVisited;
      }
  
      if (tags && Array.isArray(tags)) {
        travelLog.tags = tags;
      }
  
      await travelLog.save();
      res.status(200).json({ log: travelLog, message: "Update Successful" });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});



//Delete a Travel Log
app.delete("/delete-log/:id", authenticateToken, async(req,res) => {
    const {id} = req.params;
    const {userId} = req.user;

    try{
        //Finding the travel log by ID and ensure it belongs to the authenticated user
        const travelLog = await TravelLog.findOne({_id: id, userId: userId});
        if(!travelLog){
            return res.status(404).json({error: true, message: "Travel log not found"})
        }

        //Delete the travel log from the database.
        await travelLog.deleteOne({_id: id, userId: userId});

        //Extract the filename from the import
        const imageUrl = travelLog.imageUrl;
        if (Array.isArray(imageUrl)) {
            imageUrl.forEach((image) => {
                const filename = path.basename(image);
                const filePath = path.join(__dirname, 'uploads', filename);

                // Delete each image file
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete image file:", err);
                    }
                });
            });
        }
        res.status(200).json({ message: "Travel Log deleted successfully"}); 
    }catch(error){
        res.status(500).json({ error: true, mesage: error.message});
    }

});

//Update isFavourite
app.put("/update-favourites/:id", authenticateToken, async(req,res) => {
    const {id} = req.params;
    const {isFavourite} = req.body;
    const {userId} = req.user;

    try{
        //Finding the travel log by ID and ensure it belongs to the authenticated user
        const travelLog = await TravelLog.findOne({_id: id, userId: userId});
        if(!travelLog){
            return res.status(404).json({error: true, message: "Travel log not found"})
        }

        travelLog.isFavourite = isFavourite;
        await travelLog.save();
        res.status(200).json({ log:travelLog, message: "Update Successful"})

    }catch(error){
        res.status(500).json({ error: true, mesage: error.message});
    }

});

//Search Travel Logs
app.get("/search", authenticateToken, async(req,res) => {
    const {query} = req.query;
    const {userId} = req.user;

    if(!query){
        return res.status(404).json({error: true, message: "query is required"})
    }

    try{
        const searchResults = await TravelLog.find({
            userId: userId,
            $or:[
                {title: { $regex: query, $options: "i"}},
                {log: { $regex: query, $options: "i"}},
                {visitedLocation: { $regex: query, $options: "i"}},
            ],
        }).sort({ isFavourite: -1});

        res.status(200).json({logs:searchResults})
    }catch(error){
        res.status(500).json({error: true, mesage: error.message});
    }
});

//Filter Travel Logs By Date
app.get("/travel-logs/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        // Validate and convert timestamps properly
        const start = new Date(Number(startDate));
        const end = new Date(Number(endDate));

        // Ensure valid date conversion
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: true, message: "Invalid date range" });
        }

        const filteredLogs = await TravelLog.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });

        res.status(200).json({ logs: filteredLogs });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});



//Route to handle image upload
app.post("/image-upload", upload.array("images",10), async(req,res) => {
    console.log(req.files);
    try{
        if(!req.files || req.files.length === 0){
            return res
            .status(400)
            .json({error: true, message: "No images uploaded"})
        }

        const imageUrl = req.files.map((file) => `http://localhost:8000/uploads/${file.filename}`);
        
        res.status(200).json({imageUrl});
    }catch(error){
        console.error("Upload error:", error); 
        res.status(500).json({ error: true, message: error.message});
    }
});




//Delete an image from uploads folder
app.delete("/delete-image", async (req,res) => {
    const { imageUrl } = req.query;

    if(!imageUrl){
        return res.status(400).json({ error: true, message: "imageUrl parameter is required"})
    }

    try{
        //Extract the filename from the imageUrl
        const filename = path.basename(imageUrl);

        //Define the file path
        const filePath = path.join(__dirname, 'uploads', filename);

        //Check if the file exits
        if(fs.existsSync(filePath)){
            //Delete the file from the uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message: "Image deleted successfully"});
        }else{
            res.status(200).json({error: true, message: "Image not Found"});
        }
    }catch(error){
        res.status(500).json({error:true, message: error.message});
    }
});



//Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(port);
module.exports = app;


