import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation pour s'assurer que le mot de passe et la confirmation correspondent
    if (user.password !== user.confirmPassword) {
      setPasswordError("Password and Confirm Password do not match");
      return; // Arrêtez le traitement si les mots de passe ne correspondent pas
    }
  
    // Ajout de validation pour le numéro de téléphone
    if (user.phone.trim().length !== 8 || !/^\d+$/.test(user.phone)) {
      setPasswordError("Phone number must be 8 digits long and contain only numbers");
      return; // Arrêtez le traitement si le numéro de téléphone n'est pas valide
    }
  
    // Vérification des champs obligatoires
    const requiredFields = ["username", "email", "password", "confirmPassword", "phone", "desc"];
    for (const field of requiredFields) {
      if (!user[field].trim()) {
        setPasswordError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return; // Arrêtez le traitement si un champ obligatoire est vide
      }
    }
  
    // Continuer avec le traitement si toutes les validations passent
  
    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const countryOptions = Object.keys(countries).map((code) => (
    <option key={code} value={code}>
      {countries[code].name}
    </option>
  ));

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter username"
            onChange={handleChange}
          />

          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />

          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
          />

          <label htmlFor="">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            onChange={handleChange}
          />

          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <label htmlFor="">Country</label>
          <select
            name="country"
            onChange={handleChange}
            value={user.country}
          >
            <option value="">Select Country</option>
            {countryOptions}
          </select>

          <button type="submit">Register</button>
          {passwordError && <p>{passwordError}</p>}
        </div>

        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>

          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+216"
            onChange={handleChange}
          />

          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
