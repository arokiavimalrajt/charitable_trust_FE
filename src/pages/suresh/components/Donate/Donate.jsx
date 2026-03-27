import React, { useEffect, useState } from "react";
import tgall1 from "../Donate/Donateimage/don1.png";
import tgall2 from "../Donate/Donateimage/don2.png";
import tgall3 from "../Donate/Donateimage/don3.png";
import tgall4 from "../Donate/Donateimage/don4.png";
import tgall5 from "../Donate/Donateimage/don5.png";
import "./Donate.css";
import Popup from "./Popup.jsx"; // Import the Popup component
import api from "../../../../api/api.js";
import Card from "./Card.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

import card1 from "./Donateimage/card1.png";
import card2 from "./Donateimage/card2.png";
import card3 from "./Donateimage/card3.png";
import card4 from "./Donateimage/card4.png";
import card5 from "./Donateimage/card5.png";
import card6 from "./Donateimage/card6.png";
import card7 from "./Donateimage/card7.png";
import card8 from "./Donateimage/card8.png";

const Donate = () => {
  const [order, setOrder] = useState({});
  const [razorpayKey, setRazorpayKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to store the clicked image
  const [selectedText, setSelectedText] = useState(""); // Store selected donation type text

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 2000, // Animation duration in ms
      once: false, // Whether animation should happen only once
    });
    // Fetch Razorpay Key from the backend
    const fetchRazorpayKey = async () => {
      try {
        // console.log("Fetching Razorpay key...");
        const response = await api.get("/piKey");
        if (response.data && response.data.key) {
          setRazorpayKey(response.data.key);
        } else {
          console.error(
            "Invalid key data received from /piKey:",
            response.data,
          );
          setErrorMessage("An error occurred while fetching the payment key.");
        }
      } catch (error) {
        setErrorMessage(
          "Failed to fetch Razorpay key. Please try again later.",
        );
      }
    };

    fetchRazorpayKey();
  }, []);

  const handlePay = async (amount, donationFrequency, selectedText) => {
    try {
      if (!razorpayKey) {
        alert("Payment key not loaded. Try again.");
        return;
      }

      const response = await api.post("/pay", {
        donationType: selectedText,
        donationAmount: amount,
        donationFrequency: donationFrequency, // ✅ FIXED (was conOMY ❌)
      });

      console.log("PAY API RESPONSE:", response.data);

      if (!response.data?.order?.id) {
        throw new Error("Invalid order received from backend");
      }

      const options = {
        key: razorpayKey,
        amount: response.data.order.amount, // ✅ NO *100
        currency: "INR",
        name: "Helping Hands",
        description: "Donation Transaction",
        order_id: response.data.order.id,

        handler: function (response) {
          console.log("Payment Success:", response);
          alert("Payment Successful!");
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#0699FF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
          "There was an error processing the payment.",
      );
    }
  };

  // Function to handle image click
  const handleImageClick = (imageUrl, text) => {
    setSelectedImage(imageUrl); // Set the selected image dynamically
    setSelectedText(text); // Set the selected donation type text
    setShowPopup(true); // Show the popup
  };

  const cardData = [
    { id: "1", text: "Sponsor a Meal for child", imageUrl: card1 },
    { id: "2", text: "Sponsor a meal for homeless people", imageUrl: card2 },
    { id: "3", text: "Sponsor a Child", imageUrl: card3 },
    { id: "5", text: "Support orphanage", imageUrl: card4 },
    { id: "6", text: "Sponsor a child education", imageUrl: card5 },
    { id: "4", text: "Sponsor a Child care kit", imageUrl: card6 },
    { id: "7", text: "Support handicapped", imageUrl: card7 },
    { id: "8", text: "Flood relief", imageUrl: card8 },
  ];

  return (
    <div className="donate">
      <div className="donate-container">
        <div className="top-gallery" data-aos="zoom-out">
          <div className="tgall">
            <img src={tgall1} alt="Donation 1" />
          </div>
          <div className="tgall tgall1">
            <img src={tgall2} alt="Donation 2" />
          </div>
          <div className="tgall">
            <img src={tgall3} alt="Donation 3" />
          </div>
          <div className="tgall">
            <img src={tgall4} alt="Donation 4" />
          </div>
          <div className="tgall">
            <img src={tgall5} alt="Donation 5" />
          </div>
        </div>
        <div className="donate-text">
          <h2 data-aos="zoom-in">Support the Journey of Those in Need</h2>
          <p data-aos="fade-up">
            Your donation will provide essential support for handicapped
            individuals, homeless people, children, and those affected by
            disaster situations. Your generosity will help ensure their access
            to basic needs, such as shelter, healthcare, and nutrition, leading
            them towards a life of dignity and hope for a brighter future.
          </p>
          {/* <button className="donate-btn" onClick={() => handlePay(25000, 'ONCE')} disabled={!razorpayKey}>Donate Now</button> */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <h1 className="selectfield" data-aos="zoom-out">
          Select the particular field to donate to
        </h1>
        <div className="cardgrid">
          <div className="card-grid">
            {cardData.map((card) => (
              <Card
                key={card.id}
                imageUrl={card.imageUrl}
                text={card.text}
                onClick={handleImageClick} // Correctly pass the image URL and text of the clicked card
              />
            ))}
          </div>
        </div>
      </div>
      {/* Render Popup only if showPopup is true */}
      {showPopup && (
        <Popup
          image={selectedImage}
          onClose={() => setShowPopup(false)} // Close popup on button click
          handlePay={handlePay}
          selectedText={selectedText}
          // Pass handlePay function to Popup
        />
      )}
    </div>
  );
};

export default Donate;
