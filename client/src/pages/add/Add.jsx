import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);
  
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
  
      // Make sure to set the "cover" property in the state
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      dispatch({ type: "CHANGE_INPUT", payload: { name: "cover", value: cover } });
    } catch (err) {
      console.log(err);
    }
  };
  

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs/gigs", gig); // Update the endpoint here
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate(`/mygigs/${userId}`);
    },
  });
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = currentUser ? currentUser._id : null;

const handleSubmit = (e) => {
  e.preventDefault();
   // Check if any required field is empty
   const requiredFields = ["title", "cat", "desc", "price"];
   for (const field of requiredFields) {
     if (!state[field]) {
       window.alert(`Field '${field}' is empty. Please fill in all the fields before creating the service.`);
       return;
     }
   }

  if (!userId) {
    console.error("UserId is not defined");
    return;
  }

  const data = {
    userId: userId,
    title: state.title,
    cat: state.cat,
    desc: state.desc,
    price: state.price,
    cover: state.cover,
    images: state.images,
    features: state.features,
  };

  mutation.mutate(data);
};

  

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Service</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Create a title for your service"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
           
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
          <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Create a description to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="Add Features for  your service" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;