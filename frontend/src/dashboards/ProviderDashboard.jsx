import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import "../styles/ProviderDashboard.css";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Heart,
  User,
  LogOut,
  Search,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  IndianRupee,
  Menu,
  X,
} from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { signOut } from "firebase/auth";


import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";


// DEMO RESOURCES
// These are display-only samples. They are never written to Firestore.
const demoResources = [
  {
    id: "demo-laptop",
    name: "Used Laptop",
    category: "Electronics",
    description: "A demo laptop listing in good working condition.",
    price: 18000,
    condition: "Good",
    location: "Mohali, Punjab",
    listingType: "Sell",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900"
  },
  {
    id: "demo-study-table",
    name: "Wooden Study Table",
    category: "Furniture",
    description: "Study table suitable for students and home offices.",
    price: 2500,
    condition: "Good",
    location: "Chandigarh",
    listingType: "Sell",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900"
  },
  {
    id: "demo-books",
    name: "Engineering Books Bundle",
    category: "Books",
    description: "A bundle of engineering and academic books for students.",
    price: 0,
    condition: "Good",
    location: "Mohali, Punjab",
    listingType: "Donate",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900"
  },
  {
    id: "demo-chair",
    name: "Office Chair",
    category: "Furniture",
    description: "Comfortable office chair available for short-term rental.",
    price: 300,
    condition: "Good",
    location: "Kharar, Punjab",
    listingType: "Rent",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900"
  },
  {
    id: "demo-phone",
    name: "Android Smartphone",
    category: "Electronics",
    description: "A demo smartphone listing with charger.",
    price: 6500,
    condition: "Like New",
    location: "Mohali, Punjab",
    listingType: "Sell",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900"
  },
  {
    id: "demo-school-bags",
    name: "School Bags",
    category: "Accessories",
    description: "School bags available for students.",
    price: 0,
    condition: "Good",
    location: "Chandigarh",
    listingType: "Donate",
    providerName: "Demo Provider",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900"
  },
  {
    id: "demo-cement",
    name: "Cement Bags",
    category: "Construction Materials",
    description: "Demo listing of cement bags for small construction projects.",
    price: 380,
    condition: "New",
    location: "Mohali, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900"
  },
  {
    id: "demo-bricks",
    name: "Red Bricks",
    category: "Construction Materials",
    description: "Red clay bricks for walls and general construction.",
    price: 9,
    condition: "New",
    location: "Kharar, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900"
  },
  {
    id: "demo-sand",
    name: "Construction Sand",
    category: "Construction Materials",
    description: "Washed construction sand for masonry and concrete work.",
    price: 1600,
    condition: "New",
    location: "Mohali, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900"
  },
  {
    id: "demo-steel",
    name: "TMT Steel Rods",
    category: "Construction Materials",
    description: "Steel reinforcement rods for structural construction.",
    price: 62,
    condition: "New",
    location: "Chandigarh",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900"
  },
  {
    id: "demo-aggregate",
    name: "Gravel and Aggregate",
    category: "Construction Materials",
    description: "Aggregate material for concrete and foundation work.",
    price: 1200,
    condition: "New",
    location: "Zirakpur, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=900"
  },
  {
    id: "demo-paint",
    name: "Wall Paint",
    category: "Construction Materials",
    description: "Sealed wall paint containers for interior finishing.",
    price: 950,
    condition: "New",
    location: "Mohali, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900"
  },
  {
    id: "demo-tiles",
    name: "Floor Tiles",
    category: "Construction Materials",
    description: "Floor tiles for home renovation and construction.",
    price: 45,
    condition: "New",
    location: "Chandigarh",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
  },
  {
    id: "demo-pipes",
    name: "PVC Pipes",
    category: "Plumbing",
    description: "PVC pipes and fittings for plumbing installations.",
    price: 180,
    condition: "New",
    location: "Kharar, Punjab",
    listingType: "Sell",
    providerName: "Demo Building Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900"
  },
  {
    id: "demo-drill",
    name: "Electric Drill Machine",
    category: "Construction Tools",
    description: "Power drill available for short-term project rental.",
    price: 250,
    condition: "Good",
    location: "Mohali, Punjab",
    listingType: "Rent",
    providerName: "Demo Tool Rentals",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900"
  },
  {
    id: "demo-welder",
    name: "Welding Machine",
    category: "Construction Tools",
    description: "Portable welding machine available for rental.",
    price: 700,
    condition: "Good",
    location: "Chandigarh",
    listingType: "Rent",
    providerName: "Demo Tool Rentals",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900"
  },
  {
    id: "demo-mixer",
    name: "Concrete Mixer",
    category: "Construction Equipment",
    description: "Concrete mixer for small and medium construction sites.",
    price: 1200,
    condition: "Good",
    location: "Zirakpur, Punjab",
    listingType: "Rent",
    providerName: "Demo Tool Rentals",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900"
  },
  {
    id: "demo-ladder",
    name: "Construction Ladder",
    category: "Construction Equipment",
    description: "Portable ladder for maintenance and site work.",
    price: 150,
    condition: "Good",
    location: "Mohali, Punjab",
    listingType: "Rent",
    providerName: "Demo Tool Rentals",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900"
  },
  {
    id: "demo-wheelbarrow",
    name: "Wheelbarrow",
    category: "Construction Equipment",
    description: "Wheelbarrow for moving materials around a construction site.",
    price: 100,
    condition: "Good",
    location: "Kharar, Punjab",
    listingType: "Rent",
    providerName: "Demo Tool Rentals",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900"
  },
  {
    id: "demo-safety-gear",
    name: "Safety Helmet and Gear",
    category: "Safety Equipment",
    description: "Basic construction safety gear available as a free donation.",
    price: 0,
    condition: "Good",
    location: "Mohali, Punjab",
    listingType: "Donate",
    providerName: "Demo Safety Supplies",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900"
  }
];




export default function ProviderDashboard() {

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const [activeView, setActiveView] = useState("Dashboard");

  const [resources, setResources] = useState([]);

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [imageInputKey, setImageInputKey] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    description: "",
    price: "",
    condition: "Good",
    location: "",
    listingType: "Sell",
  });


  // -------------------------------
  // PROVIDER NAME
  // -------------------------------

  const providerName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Provider";


  // -------------------------------
  // FETCH PROVIDER RESOURCES
  // -------------------------------

  const fetchResources = async () => {

    if (!currentUser) return;

    try {

      const q = query(
        collection(db, "resources"),
        where("ownerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setResources(data);

    } catch (error) {

      console.error("Resource loading error:", error);

      alert("Unable to load your resources.");

    }
  };


  // -------------------------------
  // FETCH INCOMING REQUESTS
  // -------------------------------

  const fetchRequests = async () => {

    if (!currentUser) return;

    try {

      const q = query(
        collection(db, "requests"),
        where("providerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setRequests(data);

    } catch (error) {

      console.error("Request loading error:", error);

    }
  };


  // -------------------------------
  // LOAD DASHBOARD DATA
  // -------------------------------

  const loadDashboard = async () => {

    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await Promise.all([
        fetchResources(),
        fetchRequests(),
      ]);
    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    loadDashboard();
    // loadDashboard uses the current authenticated user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  // -------------------------------
  // FORM INPUT HANDLING
  // -------------------------------

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // -------------------------------
  // IMAGE SELECTION
  // -------------------------------

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      setSelectedImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);

  };


  // -------------------------------
  // UPLOAD IMAGE TO FIREBASE
  // -------------------------------

  const uploadImage = async () => {

    if (!selectedImage) return "";

    const safeFileName = selectedImage.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const imageRef = ref(
      storage,
      `resources/${currentUser.uid}/${Date.now()}_${safeFileName}`
    );

    await uploadBytes(imageRef, selectedImage, {
      contentType: selectedImage.type,
    });

    return await getDownloadURL(imageRef);

  };


  // -------------------------------
  // RESET FORM
  // -------------------------------

  const resetForm = () => {

    setFormData({
      name: "",
      category: "Electronics",
      description: "",
      price: "",
      condition: "Good",
      location: "",
      listingType: "Sell",
    });

    setSelectedImage(null);
    setImageInputKey((previous) => previous + 1);

    setEditingId(null);

  };


  // -------------------------------
  // ADD OR UPDATE RESOURCE
  // -------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!currentUser) return;

    if (!formData.name.trim() ||
        !formData.description.trim() ||
        !formData.location.trim()) {

      alert("Please fill all required fields.");

      return;

    }

    if (
      formData.listingType !== "Donate" &&
      (formData.price === "" ||
        !Number.isFinite(Number(formData.price)) ||
        Number(formData.price) < 0)
    ) {

      alert("Please enter a valid price.");

      return;

    }

    try {

      setSaving(true);

      let imageUrl = "";

      if (selectedImage) {

        imageUrl = await uploadImage();

      }

      const resourceData = {

        name: formData.name.trim(),

        category: formData.category,

        description: formData.description.trim(),

        price:
          formData.listingType === "Donate"
            ? 0
            : Number(formData.price),

        condition: formData.condition,

        location: formData.location.trim(),

        listingType: formData.listingType,

        ownerId: currentUser.uid,

        providerName: providerName,

      };


      if (editingId) {

        const updateData = {
          ...resourceData,
        };

        if (imageUrl) {
          updateData.imageUrl = imageUrl;
        }

        await updateDoc(
          doc(db, "resources", editingId),
          updateData
        );

        alert("Resource updated successfully!");

      } else {

        await addDoc(
          collection(db, "resources"),
          {
            ...resourceData,
            status: "available",
            imageUrl,
            createdAt: serverTimestamp(),
          }
        );

        alert("Resource added successfully!");

      }

      resetForm();

      await fetchResources();

      setActiveView("My Listings");

    } catch (error) {

      console.error("Resource saving error:", error);

      const errorMessage =
        error?.code || error?.message || "Unknown error";

      alert(
        `Unable to save resource. Firebase error: ${errorMessage}. ` +
        "Check your Firestore and Storage rules, and Firebase configuration."
      );

    } finally {

      setSaving(false);

    }

  };


  // -------------------------------
  // EDIT RESOURCE
  // -------------------------------

  const handleEdit = (resource) => {

    setFormData({

      name: resource.name || "",

      category: resource.category || "Electronics",

      description: resource.description || "",

      price: resource.price ?? "",

      condition: resource.condition || "Good",

      location: resource.location || "",

      listingType: resource.listingType || "Sell",

    });

    setEditingId(resource.id);

    setSelectedImage(null);
    setImageInputKey((previous) => previous + 1);

    setActiveView("Add Resource");

  };


  // -------------------------------
  // DELETE RESOURCE
  // -------------------------------

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "resources", id));

      alert("Resource deleted successfully.");

      await fetchResources();

    } catch (error) {

      console.error(error);

      alert("Unable to delete resource.");

    }

  };


  // -------------------------------
  // ACCEPT OR REJECT REQUEST
  // -------------------------------

  const handleRequest = async (requestId, status) => {

    try {

      await updateDoc(
        doc(db, "requests", requestId),
        {
          status: status,
        }
      );

      alert(`Request ${status} successfully.`);

      await fetchRequests();

    } catch (error) {

      console.error(error);

      alert("Unable to update request. Check Firestore rules.");

    }

  };


  // -------------------------------
  // LOGOUT
  // -------------------------------

  const handleLogout = async () => {

    try {

      await signOut(auth);

      navigate("/login");

    } catch (error) {

      console.error(error);

    }

  };


  // -------------------------------
  // DASHBOARD STATISTICS
  // -------------------------------

  // Display demo samples alongside the provider's real Firebase listings.
  // Demo entries are clearly marked and cannot be edited or deleted.
  const displayResources = [...resources, ...demoResources];

  const totalResources = displayResources.length;

  const activeResources = displayResources.filter(
    (item) => item.status === "available"
  ).length;

  const pendingRequests = requests.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedRequests = requests.filter(
    (item) => item.status === "accepted"
  ).length;


  // -------------------------------
  // SEARCH RESOURCES
  // -------------------------------

  const filteredResources = displayResources.filter((item) => {

    const search = searchTerm.toLowerCase();

    return (

      item.name?.toLowerCase().includes(search) ||

      item.category?.toLowerCase().includes(search) ||

      item.location?.toLowerCase().includes(search)

    );

  });


  // -------------------------------
  // SIDEBAR MENU
  // -------------------------------

  const menuItems = [

    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "Add Resource",
      icon: <PlusCircle size={20} />,
    },

    {
      name: "My Listings",
      icon: <Package size={20} />,
    },

    {
      name: "Incoming Requests",
      icon: <ClipboardList size={20} />,
    },

    {
      name: "Donations",
      icon: <Heart size={20} />,
    },

    {
      name: "My Profile",
      icon: <User size={20} />,
    },

  ];


  // -------------------------------
  // RESOURCE CARD
  // -------------------------------

  const ResourceCard = ({ item }) => (

    <div className="provider-resource-card">

      <div className="provider-resource-image">

        {item.imageUrl ? (

          <img
            src={item.imageUrl}
            alt={item.name}
          />

        ) : (

          <Package size={45} />

        )}

      </div>


      <div className="provider-resource-details">

        <div className="provider-card-top">

          <span className="provider-category">
            {item.category}
          </span>

          <span className={`provider-status ${item.status}`}>
            {item.isDemo ? "Demo" : (item.status || "available")}
          </span>

        </div>


        <h3>{item.name}</h3>

        <p className="provider-description">
          {item.description}
        </p>


        <div className="provider-location">

          <MapPin size={15} />

          {item.location}

        </div>


        <div className="provider-price">

          {item.listingType === "Donate" ? (
            "FREE DONATION"
          ) : (
            <>
              <IndianRupee size={16} />
              {item.price}
              {item.listingType === "Rent" ? " / rental" : ""}
            </>
          )}

        </div>


        {!item.isDemo && (
          <div className="provider-card-actions">
            <button
              className="provider-edit-btn"
              onClick={() => handleEdit(item)}
            >
              <Edit size={16} />
              Edit
            </button>

            <button
              className="provider-delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}

      </div>

    </div>

  );


  // -------------------------------
  // MAIN CONTENT
  // -------------------------------

  const renderContent = () => {

    switch (activeView) {


      // DASHBOARD

      case "Dashboard":

        return (

          <>

            <div className="provider-welcome">

              <div>

                <h1>Welcome back, {providerName}!</h1>

                <p>
                  Manage your resources and help build a sharing community.
                </p>

              </div>

              <button
                className="provider-refresh-btn"
                onClick={loadDashboard}
              >

                <RefreshCw size={17} />
                Refresh

              </button>

            </div>


            <div className="provider-stats-grid">

              <div className="provider-stat-card">

                <Package size={28} />

                <h2>{totalResources}</h2>

                <p>Total Resources</p>

              </div>


              <div className="provider-stat-card">

                <CheckCircle size={28} />

                <h2>{activeResources}</h2>

                <p>Active Listings</p>

              </div>


              <div className="provider-stat-card">

                <ClipboardList size={28} />

                <h2>{pendingRequests}</h2>

                <p>Pending Requests</p>

              </div>


              <div className="provider-stat-card">

                <Heart size={28} />

                <h2>{acceptedRequests}</h2>

                <p>Accepted Requests</p>

              </div>

            </div>


            <div className="provider-section-heading">

              <h2>Recent Listings</h2>

              <button
                onClick={() => setActiveView("My Listings")}
              >
                View All
              </button>

            </div>


            {displayResources.length === 0 ? (

              <div className="provider-empty">

                <Package size={45} />

                <h3>No resources listed yet</h3>

                <p>Start sharing your resources with the community.</p>

                <button
                  onClick={() => setActiveView("Add Resource")}
                >
                  Add Your First Resource
                </button>

              </div>

            ) : (

              <div className="provider-resource-grid">

                {displayResources.slice(0, 3).map((item) => (

                  <ResourceCard
                    key={item.id}
                    item={item}
                  />

                ))}

              </div>

            )}

          </>

        );


      // ADD RESOURCE

      case "Add Resource":

        return (

          <div className="provider-form-container">

            <h1>
              {editingId ? "Edit Resource" : "Add New Resource"}
            </h1>

            <p>
              Share a resource with people who need it.
            </p>


            <form
              onSubmit={handleSubmit}
              className="provider-form"
            >

              <label>Resource Name *</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Used Laptop"
                required
              />


              <label>Category *</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option>Electronics</option>
                <option>Furniture</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Machinery</option>
                <option>Construction Materials</option>
                <option>Construction Tools</option>
                <option>Construction Equipment</option>
                <option>Plumbing</option>
                <option>Safety Equipment</option>
                <option>Accessories</option>
                <option>Other</option>

              </select>


              <label>Description *</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your resource..."
                required
              />


              <label>Listing Type *</label>

              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
              >

                <option value="Sell">Sell</option>

                <option value="Rent">Rent</option>

                <option value="Donate">Donate</option>

              </select>


              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                value={
                  formData.listingType === "Donate"
                    ? 0
                    : formData.price
                }
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                disabled={formData.listingType === "Donate"}
                required={formData.listingType !== "Donate"}
              />


              <label>Condition *</label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >

                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Used</option>
                <option>Needs Repair</option>

              </select>


              <label>Location *</label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                required
              />


              <label>Resource Image</label>

              <div className="provider-upload-box">

                <Upload size={28} />

                <p>
                  Select an image (maximum 5 MB)
                </p>

                <input
                  key={imageInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {selectedImage && (
                  <span>{selectedImage.name}</span>
                )}

              </div>


              <div className="provider-form-actions">

                <button
                  type="submit"
                  disabled={saving}
                  className="provider-submit-btn"
                >

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Resource"
                    : "Publish Resource"}

                </button>


                <button
                  type="button"
                  className="provider-cancel-btn"
                  onClick={() => {
                    resetForm();
                    setActiveView("My Listings");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        );


      // MY LISTINGS

      case "My Listings":

        return (

          <>

            <div className="provider-page-heading">

              <div>

                <h1>My Listings</h1>

                <p>Manage all your published resources.</p>

              </div>

              <button
                className="provider-add-btn"
                onClick={() => {
                  resetForm();
                  setActiveView("Add Resource");
                }}
              >

                <PlusCircle size={18} />
                Add Resource

              </button>

            </div>


            <div className="provider-search-box">

              <Search size={20} />

              <input
                placeholder="Search your resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>


            {filteredResources.length === 0 ? (

              <div className="provider-empty">

                <Package size={40} />

                <h3>No resources found</h3>

              </div>

            ) : (

              <div className="provider-resource-grid">

                {filteredResources.map((item) => (

                  <ResourceCard
                    key={item.id}
                    item={item}
                  />

                ))}

              </div>

            )}

          </>

        );


      // INCOMING REQUESTS

      case "Incoming Requests":

        return (

          <>

            <h1>Incoming Requests</h1>

            <p>Manage requests received from resource seekers.</p>


            {requests.length === 0 ? (

              <div className="provider-empty">

                <ClipboardList size={45} />

                <h3>No requests received yet</h3>

                <p>Requests from seekers will appear here.</p>

              </div>

            ) : (

              <div className="provider-requests-list">

                {requests.map((request) => (

                  <div
                    className="provider-request-card"
                    key={request.id}
                  >

                    <div>

                      <h3>{request.resourceName}</h3>

                      <p>
                        Requested by: {request.seekerName || "Seeker"}
                      </p>

                      <span className={`provider-status ${request.status}`}>
                        {request.status}
                      </span>

                    </div>


                    {request.status === "pending" && (

                      <div className="provider-request-actions">

                        <button
                          className="provider-accept-btn"
                          onClick={() =>
                            handleRequest(request.id, "accepted")
                          }
                        >

                          <CheckCircle size={16} />
                          Accept

                        </button>


                        <button
                          className="provider-reject-btn"
                          onClick={() =>
                            handleRequest(request.id, "rejected")
                          }
                        >

                          <XCircle size={16} />
                          Reject

                        </button>

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )}

          </>

        );


      // DONATIONS

      case "Donations":

        return (

          <>

            <h1>My Donations</h1>

            <p>Resources you have made available for free.</p>


            <button
              className="provider-add-btn"
              onClick={() => {

                resetForm();

                setFormData((previous) => ({
                  ...previous,
                  listingType: "Donate",
                }));

                setActiveView("Add Resource");

              }}
            >

              <Heart size={18} />
              Add Donation

            </button>


            <div className="provider-resource-grid">

              {displayResources
                .filter((item) => item.listingType === "Donate")
                .map((item) => (

                  <ResourceCard
                    key={item.id}
                    item={item}
                  />

                ))}

            </div>

          </>

        );


      // PROFILE

      case "My Profile":

        return (

          <div className="provider-profile-card">

            <User size={50} />

            <h1>{providerName}</h1>

            <p>{currentUser?.email}</p>

            <span>Resource Provider</span>

            <p>
              Thank you for contributing to the RE:SOURCE community.
            </p>

          </div>

        );


      default:

        return null;

    }

  };


  // -------------------------------
  // MAIN RETURN
  // -------------------------------

  if (loading) {

    return (

      <div className="provider-loading">

        <RefreshCw className="provider-spinner" />

        <p>Loading Provider Dashboard...</p>

      </div>

    );

  }


  return (

    <div className="provider-dashboard">


      {/* SIDEBAR */}

      <aside className={`provider-sidebar ${mobileMenu ? "show" : ""}`}>

        <div className="provider-logo">

          <Package size={28} />

          <h2>RE:<span>SOURCE</span></h2>

          <button
            className="provider-mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X />
          </button>

        </div>


        <div className="provider-user">

          <div className="provider-avatar">
            {providerName.charAt(0).toUpperCase()}
          </div>

          <div>

            <h3>{providerName}</h3>

            <p>Resource Provider</p>

          </div>

        </div>


        <nav className="provider-navigation">

          {menuItems.map((item) => (

            <button
              key={item.name}
              className={
                activeView === item.name
                  ? "provider-menu-item active"
                  : "provider-menu-item"
              }
              onClick={() => {
                setActiveView(item.name);
                setMobileMenu(false);
              }}
            >

              {item.icon}

              <span>{item.name}</span>

              {item.name === "Incoming Requests" &&
                pendingRequests > 0 && (

                  <span className="provider-notification-count">
                    {pendingRequests}
                  </span>

                )}

            </button>

          ))}

        </nav>


        <button
          className="provider-logout"
          onClick={handleLogout}
        >

          <LogOut size={20} />

          Logout

        </button>

      </aside>


      {/* MAIN AREA */}

      <main className="provider-main">


        <header className="provider-topbar">

          <button
            className="provider-mobile-menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>

          <div>

            <h3>{activeView}</h3>

            <p>RE:SOURCE Provider Portal</p>

          </div>

          <div className="provider-topbar-user">

            <div className="provider-avatar small">
              {providerName.charAt(0).toUpperCase()}
            </div>

            <span>{providerName}</span>

          </div>

        </header>


        <section className="provider-content">

          {renderContent()}

        </section>


      </main>

    </div>

  );

}
