import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { clerkClient, ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Chat from "./models/chat.js";
import Message from "./models/message.js";
import ImageKit from "imagekit";
import UserChats from "./models/userChats.js";

// Import the new HarvestData model
import HarvestData from "./models/harvestData.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Clerk middleware
const clerkMiddleware = ClerkExpressRequireAuth();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ImageKit authentication
app.get("/api/upload", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.send(authenticationParameters);
});

// Get all chats for a user
app.get("/api/chats", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Get all chats for a user (for the sidebar)
app.get("/api/userchats", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userChats = await UserChats.findOne({ userId });
    
    if (!userChats) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(userChats.chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user chats" });
  }
});


// Also, we need to update the chat creation endpoint to add the chat to userChats
// Modify your existing chat creation endpoint
app.post("/api/chats", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { text } = req.body;

    const newChat = new Chat({
      userId,
      title: text.substring(0, 30),
    });

    await newChat.save();

    const newMessage = new Message({
      chatId: newChat._id,
      text,
      role: "user",
    });

    await newMessage.save();

    // Add the chat to userChats
    let userChats = await UserChats.findOne({ userId });
    
    if (!userChats) {
      userChats = new UserChats({
        userId,
        chats: [],
      });
    }
    
    userChats.chats.push({
      _id: newChat._id.toString(),
      title: text.substring(0, 30),
      createdAt: new Date(),
    });
    
    await userChats.save();

    res.status(201).json(newChat._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

// Delete a chat
app.delete("/api/chats/:id", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({ chatId });
    
    // Remove from userChats
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// Get all messages for a chat
app.get("/api/chats/:id/messages", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Create a new message
app.post("/api/chats/:id/messages", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const chatId = req.params.id;
    const { text, role, images } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newMessage = new Message({
      chatId,
      text,
      role,
      images,
    });

    await newMessage.save();

    // Update chat title if it's the first user message
    if (role === "user") {
      const messagesCount = await Message.countDocuments({ chatId });
      if (messagesCount <= 2) {
        chat.title = text.substring(0, 30);
        await chat.save();
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// HARVEST PLANNING ENDPOINTS

// Get user's harvest data
app.get("/api/harvest-data", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const harvestData = await HarvestData.find({ userId });
    res.status(200).json(harvestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch harvest data" });
  }
});

// Add new harvest data
app.post("/api/harvest-data", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { region, estateName, elevation, teaType, records } = req.body;
    
    // Check if user already has data for this estate
    let harvestData = await HarvestData.findOne({ 
      userId, 
      estateName,
      region 
    });
    
    if (harvestData) {
      // Add new records to existing data
      harvestData.records.push(...records);
      await harvestData.save();
    } else {
      // Create new harvest data entry
      harvestData = new HarvestData({
        userId,
        region,
        estateName,
        elevation,
        teaType,
        records
      });
      await harvestData.save();
    }
    
    res.status(201).json(harvestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save harvest data" });
  }
});

// Get yield prediction
app.get("/api/yield-prediction/:region/:month", clerkMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { region, month } = req.params;
    
    // Get user's historical data for this region
    const harvestData = await HarvestData.find({ 
      userId, 
      region 
    });
    
    if (!harvestData.length) {
      return res.status(200).json({
        prediction: {
          current: "65%", // Default prediction
          trend: "stable",
          recommendation: "Insufficient historical data. Using regional averages."
        }
      });
    }
    
    // Calculate prediction based on historical data
    const prediction = calculateYieldPrediction(harvestData, parseInt(month));
    
    res.status(200).json({ prediction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate yield prediction" });
  }
});

// Helper function to calculate yield prediction
function calculateYieldPrediction(harvestData, targetMonth) {
  // Extract all records
  const allRecords = harvestData.flatMap(data => data.records);
  
  // Filter records for the target month
  const monthRecords = allRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === targetMonth;
  });
  
  if (monthRecords.length === 0) {
    return {
      current: "60%",
      trend: "stable",
      recommendation: "No historical data for this month. Using regional averages."
    };
  }
  
  // Calculate average yield for this month
  const avgYield = monthRecords.reduce((sum, record) => sum + record.yield, 0) / monthRecords.length;
  
  // Get records from previous month to determine trend
  const prevMonthRecords = allRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === (targetMonth === 0 ? 11 : targetMonth - 1);
  });
  
  let trend = "stable";
  let percentage = "75%";
  let recommendation = "Maintain regular harvesting schedule.";
  
  if (prevMonthRecords.length > 0) {
    const prevAvgYield = prevMonthRecords.reduce((sum, record) => sum + record.yield, 0) / prevMonthRecords.length;
    
    if (avgYield > prevAvgYield * 1.1) {
      trend = "increasing";
      percentage = "85%";
      recommendation = "Optimal harvesting time approaching. Schedule additional labor.";
    } else if (avgYield < prevAvgYield * 0.9) {
      trend = "decreasing";
      percentage = "65%";
      recommendation = "Yield may be lower than usual. Consider adjusting harvest schedule.";
    }
  }
  
  // Factor in weather conditions if available
  const recentRecords = monthRecords.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const hasWeatherData = recentRecords.some(r => r.rainfall !== undefined || r.temperature !== undefined);
  
  if (hasWeatherData) {
    const avgRainfall = recentRecords.filter(r => r.rainfall !== undefined)
      .reduce((sum, r) => sum + r.rainfall, 0) / 
      recentRecords.filter(r => r.rainfall !== undefined).length;
    
    const avgTemp = recentRecords.filter(r => r.temperature !== undefined)
      .reduce((sum, r) => sum + r.temperature, 0) / 
      recentRecords.filter(r => r.temperature !== undefined).length;
    
    // Adjust prediction based on weather
    if (avgRainfall > 200) {
      percentage = Math.max(parseInt(percentage) - 10, 50) + "%";
      recommendation = "High rainfall may affect harvest quality. Consider adjusting schedule.";
    } else if (avgTemp > 30) {
      percentage = Math.max(parseInt(percentage) - 5, 50) + "%";
      recommendation += " High temperatures may stress plants. Ensure adequate irrigation.";
    }
  }
  
  return {
    current: percentage,
    trend,
    recommendation
  };
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});