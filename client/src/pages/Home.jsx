import React, { useEffect, useState } from "react";
import { Add, User } from "../utils/Svgs";
import { AuthState } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function dateFormatter(d) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(d);
  const x =
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    (date.getHours() % 12) +
    ":" +
    date.getMinutes() +
    " " +
    (date.getHours() > 11 ? "PM" : "AM");
  return x;
}

const Home = () => {
  const navigate = useNavigate();

  const { HOST, user, token, logout } = AuthState();

  const [isVisible, setIsVisible] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get(`${HOST}/api/notes/all`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      if (data.status === "success") {
        setNotes(data.data);
      }
    };

    return () => {
      fetchNotes();
    };
  }, []);

  return (
    <div className="home">
      <nav>
        <h3>All Notes</h3>
        <div className="user" onClick={() => setIsVisible((prev) => !prev)}>
          <h4>{user?.name}</h4>
          <User />
          <div className={`logout_box ${isVisible ? "visible" : ""}`}>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>
      {notes?.length > 0 ? (
        <div className="cards_wrapper">
          {notes.map((note) => (
            <div
              key={note._id}
              className="card"
              onClick={() => navigate(`/note/edit/${note._id}`)}
            >
              <h3>{note.title || note.description}</h3>
              <p>{dateFormatter(note.updatedAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <h1>Create some notes</h1>
      )}
      <div className="add_icon" onClick={() => navigate("/note/create")}>
        <Add />
      </div>
    </div>
  );
};

export default Home;
