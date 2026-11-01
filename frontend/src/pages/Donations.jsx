import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

import {
  Search,
  RefreshCw,
  Heart,
  Plus,
  X,
  Upload,
  Gift,
  MapPin,
  User,
  Package,
  Loader
} from "lucide-react";

import "../styles/Donations.css";

// DEMO DONATIONS
const demoDonations = [
  {
    id: "demo1",
    name: "School Books Collection",
    category: "Books",
    description: "A collection of school textbooks in good condition.",
    condition: "Good",
    location: "Mohali, Punjab",
    providerName: "Rahul Sharma",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&auto=format&fit=crop",
    isDemo: true
  },
  {
    id: "demo2",
    name: "Study Table",
    category: "Furniture",
    description: "A wooden study table available for someone who needs it.",
    condition: "Good",
    location: "Chandigarh",
    providerName: "Priya Verma",
    imageUrl: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&auto=format&fit=crop",
    isDemo: true
  },
  {
    id: "demo3",
    name: "Clothes for Donation",
    category: "Clothing",
    description: "Clean clothes suitable for adults and children.",
    condition: "Like New",
    location: "Mohali, Punjab",
    providerName: "Aman Singh",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&auto=format&fit=crop",
    isDemo: true
  },
  {
    id: "demo4",
    name: "Laptop Bag",
    category: "Electronics",
    description: "A useful laptop bag. Available free for someone in need.",
    condition: "Good",
    location: "Kharar, Punjab",
    providerName: "Simran Kaur",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
    isDemo: true
  }
];

function Donations() {
  const { currentUser } = useAuth();

  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [requestedIds, setRequestedIds] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    condition: "Good",
    location: "",
    image: null
  });

  // FETCH DONATIONS
  const fetchDonations = async () => {
    setLoading(true);

    try {
      const donationQuery = query(
        collection(db, "resources"),
        where("listingType", "==", "Donate"),
        where("status", "==", "available")
      );

      const snapshot = await getDocs(donationQuery);

      const realDonations = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      // Show demo data only when there are no real donations.
      setDonations(
        realDonations.length > 0
          ? realDonations
          : demoDonations
      );

      // Fetch current user's existing requests.
      if (currentUser) {
        const requestQuery = query(
          collection(db, "requests"),
          where("seekerId", "==", currentUser.uid)
        );

        const requestSnapshot = await getDocs(requestQuery);

        const existingRequests = requestSnapshot.docs.map(
          (item) => item.data().resourceId
        );

        setRequestedIds(existingRequests);
      } else {
        setRequestedIds([]);
      }
    } catch (error) {
      console.error("Donation fetching error:", error);

      // Keep the page usable if Firebase is unavailable.
      setDonations(demoDonations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [currentUser]);

  // HANDLE FORM INPUTS
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: files ? files[0] : value
    }));
  };

  // PUBLISH DONATION
  const handlePublish = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login or register before publishing a donation.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.category ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setPublishing(true);

    try {
      let imageUrl = "";

      // Upload image if selected.
      if (form.image) {
        const imageRef = ref(
          storage,
          `resources/${currentUser.uid}/${Date.now()}_${form.image.name}`
        );

        await uploadBytes(imageRef, form.image);

        imageUrl = await getDownloadURL(imageRef);
      }

      // Save donation in Firestore.
      await addDoc(collection(db, "resources"), {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        condition: form.condition,
        location: form.location.trim(),

        listingType: "Donate",
        price: 0,

        ownerId: currentUser.uid,
        providerId: currentUser.uid,

        providerName:
          currentUser.displayName ||
          currentUser.email ||
          "Community Donor",

        imageUrl,
        status: "available",
        createdAt: serverTimestamp()
      });

      alert("Your donation has been published successfully!");

      setForm({
        name: "",
        category: "",
        description: "",
        condition: "Good",
        location: "",
        image: null
      });

      setShowForm(false);

      await fetchDonations();
    } catch (error) {
      console.error("Donation publishing error:", error);

      alert(
        "Unable to publish donation. Please check your Firebase Firestore and Storage permissions."
      );
    } finally {
      setPublishing(false);
    }
  };

  // REQUEST DONATION
  const handleRequest = async (item) => {
    if (!currentUser) {
      alert("Please login or register to request a donation.");
      window.location.href = "/login";
      return;
    }

    if (item.isDemo) {
      alert("This is a sample donation, not a real listing.");
      return;
    }

    if (item.ownerId === currentUser.uid) {
      alert("You cannot request your own donation.");
      return;
    }

    if (requestedIds.includes(item.id)) {
      alert("You have already requested this donation.");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        resourceId: item.id,
        resourceName: item.name,
        providerId: item.ownerId || item.providerId,
        providerName: item.providerName || "Donor",
        seekerId: currentUser.uid,
        seekerName:
          currentUser.displayName ||
          currentUser.email ||
          "Community Member",
        listingType: "Donate",
        status: "pending",
        createdAt: serverTimestamp()
      });

      setRequestedIds((previous) => [...previous, item.id]);

      alert("Donation request submitted successfully!");
    } catch (error) {
      console.error("Request error:", error);
      alert("Unable to submit request. Please try again.");
    }
  };

  // SEARCH FILTER
  const filteredDonations = donations.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.location?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="donations-page">

      {/* HEADER */}
      <header className="donation-header">
        <div>
          <h2>RE:<span>SOURCE</span></h2>
          <p>Give resources a second life.</p>
        </div>

        <Heart size={28} />
      </header>

      {/* HERO SECTION */}
      <section className="donation-hero">
        <div className="donation-hero-content">
          <span>SHARE • CARE • REUSE</span>

          <h1>
            Free Resources.
            <br />
            <strong>Meaningful Impact.</strong>
          </h1>

          <p>
            Discover free resources shared by generous
            people in your community.
          </p>

          <button
            className="add-donation-btn"
            onClick={() => {
              if (!currentUser) {
                alert("Please login or register to publish a donation.");
                window.location.href = "/login";
                return;
              }

              setShowForm(true);
            }}
          >
            <Plus size={18} />
            Give a Donation
          </button>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="donations-container">

        {/* SEARCH */}
        <div className="donation-search">
          <div className="search-box">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search donations by name, category or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="refresh-btn"
            onClick={fetchDonations}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* TITLE */}
        <div className="donation-title">
          <div>
            <h2>Available Donations</h2>
            <p>{filteredDonations.length} resources available</p>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="donation-empty">
            <Loader className="spin" size={35} />
            <p>Loading donations...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="donation-empty">
            <Package size={45} />
            <h3>No donations found</h3>
            <p>Try another search or publish a donation.</p>
          </div>
        ) : (

          /* DONATION CARDS */
          <div className="donation-grid">
            {filteredDonations.map((item) => (
              <div className="donation-card" key={item.id}>

                <div className="donation-image">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <Gift size={48} />
                      <span>Free Donation</span>
                    </div>
                  )}

                  <span className="free-badge">FREE</span>
                </div>

                <div className="donation-card-content">

                  <span className="category-badge">
                    {item.category}
                  </span>

                  <h3>{item.name}</h3>

                  <p className="donation-description">
                    {item.description}
                  </p>

                  <div className="donation-details">
                    <span>
                      <MapPin size={15} />
                      {item.location}
                    </span>

                    <span>
                      <User size={15} />
                      {item.providerName || "Community Donor"}
                    </span>
                  </div>

                  <div className="donation-condition">
                    Condition: <strong>{item.condition}</strong>
                  </div>

                  <button
                    className="request-btn"
                    disabled={
                      item.isDemo ||
                      requestedIds.includes(item.id) ||
                      (currentUser && item.ownerId === currentUser.uid)
                    }
                    onClick={() => handleRequest(item)}
                  >
                    {item.isDemo
                      ? "Demo Listing"
                      : requestedIds.includes(item.id)
                      ? "Request Sent"
                      : currentUser && item.ownerId === currentUser.uid
                      ? "Your Donation"
                      : "Request Donation"}
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ADD DONATION MODAL */}
      {showForm && (
        <div className="donation-modal-overlay">

          <div className="donation-modal">

            <div className="modal-header">
              <div>
                <h2>Give a Donation</h2>
                <p>Share something useful with your community.</p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowForm(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handlePublish}>

              <label>Resource Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Example: Study Table"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Household">Household</option>
                <option value="Other">Other</option>
              </select>

              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the item you want to donate..."
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
              />

              <label>Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>

              <label>Location *</label>
              <input
                type="text"
                name="location"
                placeholder="Example: Mohali, Punjab"
                value={form.location}
                onChange={handleChange}
                required
              />

              <label>Upload Resource Image</label>

              <label className="image-upload">
                <Upload size={20} />
                {form.image
                  ? form.image.name
                  : "Choose an image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </label>

              <button
                type="submit"
                className="publish-donation-btn"
                disabled={publishing}
              >
                {publishing
                  ? "Publishing..."
                  : "Publish Donation"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Donations;