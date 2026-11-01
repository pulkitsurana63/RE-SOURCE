import { useState } from "react";

import {
  doc,
  getDoc,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function SeedDemoData() {

  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // DEMO RESOURCES
  const resources = [

    {
      id: "demo_resource_01",
      name: "Dell Latitude Laptop",
      category: "Electronics",
      description: "Dell laptop suitable for students and office work.",
      price: 8000,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_02",
      name: "HP LED Monitor",
      category: "Electronics",
      description: "22-inch working monitor.",
      price: 2500,
      condition: "Excellent",
      location: "Chandigarh"
    },

    {
      id: "demo_resource_03",
      name: "Office Chair",
      category: "Furniture",
      description: "Comfortable ergonomic office chair.",
      price: 1200,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_04",
      name: "Wooden Study Table",
      category: "Furniture",
      description: "Wooden study table for students.",
      price: 2000,
      condition: "Excellent",
      location: "Zirakpur"
    },

    {
      id: "demo_resource_05",
      name: "Engineering Books Set",
      category: "Books",
      description: "Collection of engineering textbooks.",
      price: 0,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_06",
      name: "Computer Keyboard",
      category: "Electronics",
      description: "USB mechanical keyboard.",
      price: 500,
      condition: "Good",
      location: "Ludhiana"
    },

    {
      id: "demo_resource_07",
      name: "Sewing Machine",
      category: "Machinery",
      description: "Working sewing machine.",
      price: 3000,
      condition: "Good",
      location: "Chandigarh"
    },

    {
      id: "demo_resource_08",
      name: "School Uniform Set",
      category: "Clothing",
      description: "Reusable school uniform.",
      price: 200,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_09",
      name: "Wooden Bookshelf",
      category: "Furniture",
      description: "Five-shelf wooden bookshelf.",
      price: 1800,
      condition: "Good",
      location: "Ludhiana"
    },

    {
      id: "demo_resource_10",
      name: "Desktop Computer",
      category: "Electronics",
      description: "Working desktop computer for basic tasks.",
      price: 6500,
      condition: "Good",
      location: "Chandigarh"
    },

    {
      id: "demo_resource_11",
      name: "Physics Textbooks",
      category: "Books",
      description: "Collection of physics textbooks.",
      price: 300,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_12",
      name: "Office Workstation",
      category: "Furniture",
      description: "Reusable office workstation.",
      price: 3500,
      condition: "Excellent",
      location: "Zirakpur"
    },

    {
      id: "demo_resource_13",
      name: "Electric Drill Machine",
      category: "Machinery",
      description: "Electric drilling machine.",
      price: 1500,
      condition: "Good",
      location: "Ludhiana"
    },

    {
      id: "demo_resource_14",
      name: "College Backpack",
      category: "Clothing",
      description: "Reusable college backpack.",
      price: 250,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_resource_15",
      name: "Wooden Dining Table",
      category: "Furniture",
      description: "Six-seater wooden dining table.",
      price: 4500,
      condition: "Good",
      location: "Chandigarh"
    }

  ];


  // DEMO DONATIONS
  const donations = [

    {
      id: "demo_donation_01",
      name: "Used Laptops",
      category: "Electronics",
      description: "Working laptops donated for students.",
      quantity: 3,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_donation_02",
      name: "Engineering Books",
      category: "Books",
      description: "Engineering textbooks for needy students.",
      quantity: 25,
      condition: "Good",
      location: "Chandigarh"
    },

    {
      id: "demo_donation_03",
      name: "Office Chairs",
      category: "Furniture",
      description: "Reusable office chairs.",
      quantity: 10,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_donation_04",
      name: "School Uniforms",
      category: "Clothing",
      description: "Clean school uniforms for children.",
      quantity: 20,
      condition: "Good",
      location: "Ludhiana"
    },

    {
      id: "demo_donation_05",
      name: "Desktop Computers",
      category: "Electronics",
      description: "Working desktop computers for educational use.",
      quantity: 5,
      condition: "Good",
      location: "Chandigarh"
    },

    {
      id: "demo_donation_06",
      name: "Study Tables",
      category: "Furniture",
      description: "Study tables for students.",
      quantity: 4,
      condition: "Good",
      location: "Zirakpur"
    },

    {
      id: "demo_donation_07",
      name: "Children Story Books",
      category: "Books",
      description: "Story books for school libraries.",
      quantity: 40,
      condition: "Good",
      location: "Mohali"
    },

    {
      id: "demo_donation_08",
      name: "Winter Clothes",
      category: "Clothing",
      description: "Clean winter clothes for donation.",
      quantity: 30,
      condition: "Good",
      location: "Ludhiana"
    }

  ];


  // SEED FIREBASE DATABASE
  const seedDatabase = async () => {

    if (!currentUser) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      // VERIFY PROVIDER ACCOUNT
      const userSnapshot = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      if (!userSnapshot.exists()) {
        throw new Error("User profile not found.");
      }

      if (userSnapshot.data().role !== "provider") {
        throw new Error(
          "Please login using your Resource Provider account."
        );
      }

      const batch = writeBatch(db);

      const providerName =
        userSnapshot.data().name ||
        currentUser.email;

      // ADD RESOURCES
      resources.forEach((item) => {

        const { id, ...data } = item;

        batch.set(
          doc(db, "resources", id),
          {
            ...data,
            ownerId: currentUser.uid,
            providerName,
            imageUrl: "",
            status: "available",
            createdAt: serverTimestamp()
          },
          { merge: true }
        );

      });


      // ADD DONATIONS
      donations.forEach((item) => {

        const { id, ...data } = item;

        batch.set(
          doc(db, "donations", id),
          {
            ...data,
            donorId: currentUser.uid,
            donorName: providerName,
            imageUrl: "",
            status: "available",
            createdAt: serverTimestamp()
          },
          { merge: true }
        );

      });


      // SAVE ALL DOCUMENTS
      await batch.commit();

      setMessage(
        "Success! 15 resources and 8 donations added to Firebase."
      );

    } catch (error) {

      console.error("Demo data error:", error);

      setMessage(error.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div style={{
      minHeight: "100vh",
      background: "#f0f7f1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        width: "420px",
        textAlign: "center"
      }}>

        <h1 style={{ color: "#16834f" }}>
          RE:SOURCE
        </h1>

        <h2>Demo Data Manager</h2>

        <p>
          Add sample resources and donations
          to your Firebase database.
        </p>

        <h3>15 Resources</h3>

        <h3>8 Donations</h3>

        <button
          onClick={seedDatabase}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: "#16834f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >

          {loading
            ? "Adding Demo Data..."
            : "Generate Demo Data"}

        </button>

        {message && (
          <p style={{ marginTop: "20px" }}>
            {message}
          </p>
        )}

      </div>

    </div>

  );

}

export default SeedDemoData;