//start building node.js and express server
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
            userName: user.userName,
            email: user.email,
            bio: user.bio,
            following: user.following,
            followers: user.followers,
            savedPosts: user.savedPosts,
            likedPosts: user.likedPosts,
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
        budget,    
        season,    
        weather 
      } = req.body;
    
    const { userId } = req.user

    //Validate required fields
    if(!title || !log  || !visitedLocation || !imageUrl || !visitedDate ){
        return res.status(400).json({ eror: true, message: "All fields are required"})
    }

    //Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try{
        const travelLog = new TravelLog({
            title, 
            log, 
            visitedLocation, 
            placesVisited, 
            userId,
            imageUrl, 
            visitedDate: parsedVisitedDate, 
        });

        await travelLog.save();
        res.status(201).json({ log: travelLog, message: 'Added Successfully'});
    }catch(error){
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
app.post("/edit-log/:id", authenticateToken, async(req,res) => {
    const {id} = req.params;
    const { title, log, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    //Validate required fields
    if(!title || !log  || !visitedLocation || !imageUrl || !visitedDate ){
        return res.status(400).json({ eror: true, message: "All fields are required"})
    }

    //Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        //Finding the travel log by ID and ensure it belongs to the authenticated user
        const travelLog = await TravelLog.findOne({_id: id, userId: userId});
        if(!travelLog){
            return res.status(404).json({error: true, message: "Travel log not found"})
        }

        const placeholderImgUrl = `http://localhost:8000/assets/Screenshot 2025-03-26 140750.png`
        travelLog.title = title;
        travelLog.log = log;
        travelLog.visitedLocation = visitedLocation ;
        travelLog.imageUrl = imageUrl || placeholderImgUrl;
        travelLog.visitedDate = parsedVisitedDate;

        await travelLog.save();
        res.status(200).json({ log:travelLog, message:"Update Successful"});

    }catch(error){
        res.status(500).json({ error: true, mesage: error.message});
    }

});





//Route to handle image upload
app.post("/image-upload", upload.single("image"), async(req,res) => {
    try{
        if(!req.file){
            return res
            .status(400)
            .json({error: true, message: "No image uploaded"})
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

        res.status(201).json({imageUrl});
    }catch(error){
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

app.listen(8000);
module.exports = app;



