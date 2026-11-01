import { useState } from "react";

import {
createUserWithEmailAndPassword,
updateProfile
} from "firebase/auth";

import {
doc,
setDoc,
serverTimestamp
} from "firebase/firestore";

import { useNavigate, Link } from "react-router-dom";

import { auth, db } from "../services/firebase";

import "../styles/auth.css";

function Register() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: ""
});

const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleRegister = async (e) => {
e.preventDefault();

setMessage("");

if (form.name.trim().length < 2) {
  setMessage("Please enter your full name.");
  return;
}

if (form.password.length < 6) {
  setMessage("Password must contain at least 6 characters.");
  return;
}

setLoading(true);

try {
  // Create Firebase authentication account
  const result = await createUserWithEmailAndPassword(
    auth,
    form.email.trim(),
    form.password
  );

  // Save user's display name
  await updateProfile(result.user, {
    displayName: form.name.trim()
  });

  // Create user profile in Firestore
  await setDoc(
    doc(db, "users", result.user.uid),
    {
      uid: result.user.uid,
      name: form.name.trim(),
      email: form.email.trim(),

      // General community account
      role: "user",

      // Every user can perform both activities
      capabilities: [
        "seeker",
        "provider"
      ],

      createdAt: serverTimestamp()
    }
  );

  setMessage("Registration successful! Redirecting...");

  // Redirect after successful registration
  setTimeout(() => {
    navigate("/choose-action", {
      replace: true
    });
  }, 1000);

} catch (error) {
  console.error("Registration error:", error);

  if (error.code === "auth/email-already-in-use") {
    setMessage("This email is already registered. Please login.");
  } else if (error.code === "auth/invalid-email") {
    setMessage("Please enter a valid email address.");
  } else if (error.code === "auth/weak-password") {
    setMessage("Please choose a stronger password.");
  } else {
    setMessage("Registration failed: " + error.message);
  }

} finally {
  setLoading(false);
}


};

return ( <div className="auth-container">


  <form
    className="auth-form"
    onSubmit={handleRegister}
  >

    <h1>Join RE:SOURCE</h1>

    <p>Create your community account</p>

    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={form.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={form.email}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      name="password"
      placeholder="Password (minimum 6 characters)"
      value={form.password}
      onChange={handleChange}
      minLength={6}
      required
    />

    <div className="registration-info">
      <h3>One Account. Multiple Possibilities.</h3>

      <p>
        As a RE:SOURCE member, you can:
      </p>

      <ul>
        <li>Find and request resources</li>
        <li>Publish resources for sale or rent</li>
        <li>Donate resources to others</li>
        <li>Request free donations</li>
      </ul>
    </div>

    <button
      type="submit"
      disabled={loading}
    >
      {loading ? "Creating Account..." : "Create Account"}
    </button>

    {message && (
      <p className="auth-message">
        {message}
      </p>
    )}

    <p>
      Already have an account?{" "}
      <Link to="/login">Login</Link>
    </p>

  </form>

</div>


);
}

export default Register;
