import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Get location details
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();

    const timestamp = new Date().toLocaleString();

    // Setup email transport (Gmail example)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your@gmail.com",
        pass: "your-app-password" // use an App Password, not your Gmail login
      }
    });

    // Send email to yourself
    await transporter.sendMail({
      from: "your@gmail.com",
      to: "your@gmail.com",
      subject: "New Subscriber",
      text: `
        New Subscriber Details:
        ------------------------
        Email: ${email}
        IP: ${ip}
        Location: ${geoData.city}, ${geoData.country_name}
        Time: ${timestamp}
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
