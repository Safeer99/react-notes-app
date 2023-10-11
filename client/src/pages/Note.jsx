import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Delete } from "../utils/Svgs";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthState } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

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

const Note = ({ create, edit }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const textareaRef = useRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const { HOST, token } = AuthState();

  function onChange(e) {
    setDescription(e.target.value);
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height =
      Math.max(textareaRef.current.scrollHeight, 32) + "px";
  }

  const createNote = async () => {
    const { data } = await axios.post(
      `${HOST}/api/notes/create`,
      { title, description },
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );
    if (data.status === "success") {
      toast.success("Note created successfully");
    } else {
      toast.error("Some error occurred");
    }
  };

  const updateNote = async ({ id }) => {
    const { data } = await axios.patch(
      `${HOST}/api/notes/${id}`,
      { title, description },
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );
    if (data.status === "success") {
      toast.success("Note updated successfully");
    } else {
      toast.error("Some error occurred");
    }
  };

  const deleteNote = async (id) => {
    await axios.delete(`${HOST}/api/notes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    toast.success("Note deleted successfully");
  };

  function onSave() {
    if (create && (title.trim() !== "" || description.trim() !== "")) {
      createNote();
    } else if (edit) {
      const id = location.pathname.split("/").reverse()[0];
      if (title.trim() === "" && description.trim() === "") {
        toast.error("cannot save empty note");
      } else {
        updateNote(id);
      }
    }
  }

  function onDelete() {
    const id = location.pathname.split("/").reverse()[0];
    deleteNote(id);
    navigate("/home");
  }

  useEffect(() => {
    const fetchNote = async (id) => {
      const { data } = await axios.get(`${HOST}/api/notes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      if (data.status === "success") {
        setTitle(data.data.title);
        setDescription(data.data.description);
        setDate(dateFormatter(data.data.updatedAt));
      } else {
        toast.error("Some error occurred");
      }
    };
    if (edit) {
      const id = location.pathname.split("/").reverse()[0];
      fetchNote(id);
    }
  }, []);

  return (
    <div className="note">
      <nav>
        <div className="icon_box" onClick={() => navigate("/home")}>
          <ArrowLeft />
        </div>
        <div className="icon_box" onClick={onSave}>
          SAVE
        </div>
        {edit && (
          <div className="icon_box" onClick={onDelete}>
            <Delete />
          </div>
        )}
      </nav>
      <div className="note_wrapper">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          placeholder="Title"
        />
        <p>
          {date || dateFormatter(new Date())} | {description.length} characters
        </p>
        <textarea
          value={description}
          ref={textareaRef}
          onChange={onChange}
          name="description"
          style={{ width: "100%" }}
          placeholder="write something here ..."
        ></textarea>
      </div>
    </div>
  );
};

export default Note;
