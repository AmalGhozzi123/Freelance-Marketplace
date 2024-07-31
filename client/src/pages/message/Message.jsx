import React from "react";
import { Link,useParams } from "react-router-dom";
import "./Message.scss";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";


const Message = () => {
  const {id} =useParams();
  const currentUser =JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });
  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`,message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId:id,
      desc:e.target[0].value,
    });
    e.target[0].value="";
  };
  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> 
        </span>
        {isLoading ? ("loading") : error ? 
        ("error") :( 
        <div className="messages">
          {data.map((m)=> ( 

          
          <div className={m.userId === currentUser._id ? "owner item" :"item"} key={m._id}>
            <img
              src={currentUser.img || m.img }
              alt=""
            />
            <span id="d">{m.date}</span>
            <p>
              {m.desc}
            </p>
            
          </div>
          ))}
        </div>)}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;