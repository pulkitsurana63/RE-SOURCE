import { useState, useEffect } from "react";

import {
  Search,
  MapPin,
  Heart,
  Package,
  Bell,
  User,
  ArrowRight,
  Recycle,
  LogOut,
  RefreshCw
} from "lucide-react";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import { db, auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import "./SeekerDashboard.css";


function SeekerDashboard() {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [wishlist, setWishlist] = useState([]);

  const [activeView, setActiveView] = useState("Dashboard");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const categories = [
    "All",
    "Electronics",
    "Furniture",
    "Books",
    "Clothing",
    "Machinery",
    "Other"
  ];


  // LOAD RESOURCES FROM FIRESTORE

  const fetchResources = async () => {

    try {

      setLoading(true);
      setError("");

      const snapshot = await getDocs(
        collection(db, "resources")
      );

      const resourceData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      const availableResources = resourceData.filter(
        (item) => !item.status || item.status === "available"
      );

      setResources(availableResources);

    } catch (err) {

      console.error("Resource loading error:", err);

      setError("Unable to load resources. Please try again.");

    } finally {

      setLoading(false);

    }

  };


  // LOAD USER REQUESTS

  const fetchRequests = async () => {

    if (!currentUser) return;

    try {

      const requestQuery = query(
        collection(db, "requests"),
        where("seekerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(requestQuery);

      const requestData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setRequests(requestData);

    } catch (err) {

      console.error("Request loading error:", err);

    }

  };


  // LOAD DATA

  useEffect(() => {

    if (!currentUser) return;

    fetchResources();
    fetchRequests();

    const savedWishlist = JSON.parse(
      localStorage.getItem(`wishlist_${currentUser.uid}`) || "[]"
    );

    setWishlist(savedWishlist);

  }, [currentUser]);


  // SEARCH AND CATEGORY FILTER

  const filteredResources = resources.filter((item) => {

    const searchText = search.toLowerCase();

    const matchesSearch = [
      item.name,
      item.category,
      item.location,
      item.description
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesCategory =
      category === "All" || item.category === category;

    const matchesWishlist =
      activeView !== "Wishlist" || wishlist.includes(item.id);

    return matchesSearch && matchesCategory && matchesWishlist;

  });


  // WISHLIST

  const toggleWishlist = (id) => {

    const updatedWishlist = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];

    setWishlist(updatedWishlist);

    localStorage.setItem(
      `wishlist_${currentUser.uid}`,
      JSON.stringify(updatedWishlist)
    );

  };


  // REQUEST RESOURCE

  const requestResource = async (item) => {

    if (!currentUser) return;

    try {

      setMessage("");

      const alreadyRequested = requests.some(
        (request) =>
          request.resourceId === item.id &&
          !["rejected", "cancelled"].includes(request.status)
      );

      if (alreadyRequested) {

        setMessage("You have already requested this resource.");

        return;

      }

      await addDoc(collection(db, "requests"), {

        resourceId: item.id,

        resourceName: item.name,

        seekerId: currentUser.uid,

        providerId: item.ownerId,

        seekerName: currentUser.displayName || currentUser.email,

        status: "pending",

        createdAt: serverTimestamp()

      });

      setMessage("Resource request submitted successfully!");

      await fetchRequests();

    } catch (err) {

      console.error("Request error:", err);

      setMessage("Unable to submit request. Please try again.");

    }

  };


  // LOGOUT

  const handleLogout = async () => {

    await signOut(auth);

    navigate("/login");

  };


  // PRICE FORMAT

  const formatPrice = (price) => {

    if (price === 0 || price === "0" || price === "Free") {
      return "Free";
    }

    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }

    return price || "Contact provider";

  };


  // CATEGORY ICONS

  const getIcon = (category) => {

    const icons = {
      Electronics: "💻",
      Furniture: "🪑",
      Books: "📚",
      Clothing: "👕",
      Machinery: "⚙️",
      Other: "📦"
    };

    return icons[category] || "📦";

  };


  if (!currentUser) {

    return <p>Loading user account...</p>;

  }


  return (

    <div className="seeker-dashboard">


      {/* SIDEBAR */}

      <aside className="seeker-sidebar">

        <h2>

          <Recycle size={27} />

          RE:SOURCE

        </h2>


        <nav>

          {[
            "Dashboard",
            "Browse Resources",
            "My Requests",
            "Wishlist",
            "Notifications",
            "My Profile"
          ].map((item) => (

            <a

              key={item}

              className={activeView === item ? "active" : ""}

              onClick={() => setActiveView(item)}

            >

              {item}

            </a>

          ))}

        </nav>


        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <LogOut size={16} />

          Logout

        </button>

      </aside>



      {/* MAIN CONTENT */}

      <main className="seeker-main">


        {/* HEADER */}

        <header className="seeker-header">

          <div>

            <h1>Resource Seeker</h1>

            <p>
              Find resources. Save money. Reduce waste.
            </p>

          </div>


          <div className="seeker-user">

            <Bell />

            <User />

          </div>

        </header>



        {/* WELCOME */}

        <section className="seeker-welcome">

          <h1>Find What You Need!</h1>

          <p>
            Discover reusable resources available around you.
          </p>


          <div className="seeker-search">

            <Search />

            <input

              type="text"

              placeholder="Search laptops, furniture, books..."

              value={search}

              onChange={(e) => setSearch(e.target.value)}

            />


            <button onClick={fetchResources}>

              Search

            </button>

          </div>

        </section>



        {/* STATISTICS */}

        <section className="seeker-stats">


          <div>

            <Package />

            <h2>{resources.length}</h2>

            <p>Available Resources</p>

          </div>


          <div>

            <Heart />

            <h2>{wishlist.length}</h2>

            <p>Wishlist Items</p>

          </div>


          <div>

            <Recycle />

            <h2>{requests.length}</h2>

            <p>My Requests</p>

          </div>


        </section>



        {/* CATEGORIES */}

        {activeView !== "My Requests" &&
         activeView !== "My Profile" &&
         activeView !== "Notifications" && (

          <section className="seeker-categories">

            <h2>Explore Categories</h2>


            <div className="category-buttons">

              {categories.map((item) => (

                <button

                  key={item}

                  className={category === item ? "selected" : ""}

                  onClick={() => setCategory(item)}

                >

                  {item}

                </button>

              ))}

            </div>

          </section>

        )}



        {/* RESOURCE SECTION */}

        {(activeView === "Dashboard" ||
          activeView === "Browse Resources" ||
          activeView === "Wishlist") && (

          <section className="seeker-resources">


            <div className="resource-heading">

              <h2>

                {activeView === "Wishlist"
                  ? "My Wishlist"
                  : "Available Resources"}

              </h2>

              <span>{filteredResources.length} results</span>

            </div>


            {loading && (

              <p>Loading resources from Firebase...</p>

            )}


            {error && (

              <p>{error}</p>

            )}


            {message && (

              <p>{message}</p>

            )}


            {!loading && (

              <div className="resource-grid">


                {filteredResources.map((item) => (

                  <div className="resource-card" key={item.id}>


                    <div className="resource-image">


                      {item.imageUrl ? (

                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />

                      ) : (

                        <span>{getIcon(item.category)}</span>

                      )}


                      <button

                        onClick={() => toggleWishlist(item.id)}

                        className="wishlist-button"

                        aria-label="Toggle wishlist"

                      >

                        <Heart

                          fill={
                            wishlist.includes(item.id)
                              ? "red"
                              : "none"
                          }

                          color={
                            wishlist.includes(item.id)
                              ? "red"
                              : "black"
                          }

                        />

                      </button>

                    </div>



                    <div className="resource-details">


                      <span className="resource-category">

                        {item.category}

                      </span>


                      <h3>{item.name}</h3>


                      <p>

                        <MapPin size={15} />

                        {item.location || "Location not specified"}

                      </p>


                      <p>

                        Condition: {item.condition || "Not specified"}

                      </p>


                      <div className="resource-bottom">

                        <h3>{formatPrice(item.price)}</h3>


                        <button

                          onClick={() => requestResource(item)}

                        >

                          Request

                          <ArrowRight size={15} />

                        </button>

                      </div>


                    </div>


                  </div>

                ))}


              </div>

            )}


            {!loading && filteredResources.length === 0 && (

              <p className="no-resources">

                No resources found. Try another search.

              </p>

            )}


          </section>

        )}



        {/* MY REQUESTS */}

        {activeView === "My Requests" && (

          <section className="seeker-resources">

            <h2>My Resource Requests</h2>


            {requests.length === 0 ? (

              <p className="no-resources">

                You haven't requested any resources yet.

              </p>

            ) : (

              requests.map((item) => (

                <div className="resource-card resource-details" key={item.id}>

                  <h3>{item.resourceName}</h3>

                  <p>Request ID: {item.id}</p>

                  <p>
                    Status: {item.status}
                  </p>

                </div>

              ))

            )}

          </section>

        )}


      </main>

    </div>

  );

}


export default SeekerDashboard;