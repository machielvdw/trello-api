import express from "express";
import axios from "axios";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.TRELLO_API_KEY;
const apiToken = process.env.TRELLO_API_TOKEN;

app.use(express.json());

// Endpoint to create a Trello card
app.post("/create-card", async (req, res) => {
  const { name, desc, idList } = req.body;
  try {
    const response = await fetch(`https://api.trello.com/1/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: apiKey,
        token: apiToken,
        name: name,
        desc: desc,
        idList: idList,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      return res.status(response.status).send(`Error from Trello: ${errorText}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Caught error:", error);
    res.status(500).send("Error creating card");
  }
});

// Endpoint to add a comment to a Trello card
app.post("/add-comment", async (req, res) => {
  const { cardId, comment } = req.body;
  try {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/actions/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: apiKey,
        token: apiToken,
        text: comment,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      return res.status(response.status).send(`Error from Trello: ${errorText}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Caught error:", error);
    res.status(500).send("Error adding comment");
  }
});

async function testCreateCard() {
  try {
    const response = await axios.post("http://localhost:3000/create-card", {
      name: "Test Card from Node.js",
      desc: "This is a test card description.",
      idList: "6654e8abd5584a1a4c387f3b",
    });
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

async function testAddComment(cardId) {
  try {
    const response = await axios.post("http://localhost:3000/add-comment", {
      cardId: cardId,
      comment: "This is a test comment.",
    });
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // Test the /create-card endpoint after the server starts
  setTimeout(async () => {
    // await testCreateCard();
    await testAddComment('CARD_ID');
  }, 2000); // Wait 2 seconds to ensure the server has started
});
