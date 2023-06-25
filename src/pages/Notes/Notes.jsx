import React, { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./notes.css";
import ReactMarkdown from "react-markdown";
import Navbar from "../../components/Navbar/Navbar";
import imgDelete from "../../icons/icons8-delete.svg";
import imgSave from "../../icons/icons8-save-50.png";
import imgClose from "../../icons/icons8-close-50.png";

function editableElement(e) {
  const element = e.target;
  element.contentEditable = true;
}

const Note = ({
  setDisplayNewNote,
  title,
  body,
  setTitle,
  setBody,
  id,
  setFetchNotes,
}) => {
  async function saveNote() {
    const response = await fetch("http://localhost:5000/notes/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body: body.replace(/<br>/g, "\n"),
        id,
      }),
    });

    const data = await response.json();
    console.log(data);
    setFetchNotes(true);
  }

  function closeNote() {
    setDisplayNewNote(false);
    setTitle("Title");
    setBody("Body");
  }

  return (
    <div className="ind-note">
      <div className="note-content">
        <h1
          onClick={editableElement}
          onBlur={(e) => setTitle(e.target.textContent)}
        >
          {title}
        </h1>
        <textarea
          className="text-area-note"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        >
          {body}
        </textarea>
      </div>
      <div className="note-actions">
        <input type="submit" value="save note" onClick={saveNote} />
        <input type="submit" value="close note" onClick={closeNote} />
      </div>
    </div>
  );
};

const IndividualNotes = ({ details, setFullScreenNote }) => {
  const processedMarkdown = details.body.replace(/<br>/g, "\n");
  return (
    <div className="single-note" onClick={() => setFullScreenNote(details)}>
      <h1>
        {details.title.length > 20
          ? `${details.title.slice(0, 20)}...`
          : details.title}
      </h1>
      <ReactMarkdown
        className="md"
        children={
          processedMarkdown.length > 150
            ? `${processedMarkdown.slice(0, 150)}...`
            : processedMarkdown
        }
      />
    </div>
  );
};

const NoteFullScreen = ({ note, closeFullScreen, checkOpen, closeNew }) => {
  const headingRef = useRef(null);
  const contentRef = useRef(null);

  if (checkOpen) {
    closeNew(false);
  }

  async function deleteNote() {
    const response = await fetch(`http://localhost:5000/notes/${note._id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    closeFullScreen();
    console.log(data);
  }

  async function patchNote() {
    const response = await fetch(`http://localhost:5000/notes/${note._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: headingRef.current.textContent,
        body: contentRef.current.value,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <div className="note-full">
        <div className="note-full-action">
          <img
            src={imgDelete}
            alt="delete"
            onClick={deleteNote}
            className="btn-del"
            style={{ width: "50px", height: "50px" }}
          />
          <img
            src={imgSave}
            alt="save"
            className="btn-save"
            onClick={patchNote}
            style={{ width: "50px", height: "50px" }}
          />
          <img
            src={imgClose}
            alt="close"
            className="btn-close"
            onClick={closeFullScreen}
            style={{ width: "50px", height: "50px" }}
          />
        </div>
        <div className="note-container">
          <div className="note-wrapper">
            <h1
              className="note-full-heading"
              onClick={editableElement}
              ref={headingRef}
            >
              {note.title}
            </h1>

            <textarea
              key={note._id}
              className="text-area-note"
              ref={contentRef}
              defaultValue={note.body}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

const Notes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [displayNewNote, setDisplayNewNote] = useState(false);
  const [title, setTitle] = useState("Title");
  const [body, setBody] = useState("Body");
  const [id, setId] = useState("");
  const [previousNotes, setPreviousNotes] = useState([]);
  const [displayPrevious, setDisplayPrevious] = useState(false);
  const [fetchNotes, setFetchNotes] = useState(false);
  const [fullScreenNote, setFullScreenNote] = useState(null);
  const [background, setBackground] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/");
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded.username);
      setId(decoded.id);
    }
  }, [navigate]);

  useEffect(() => {
    const response = fetch(`http://localhost:5000/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application.json",
      },
    })
      .then((data) => data.json())
      .then((data) => setBackground(data.background));
  });

  useEffect(() => {
    setFetchNotes(true);

    const fetchPreviousNotes = async () => {
      const response = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setPreviousNotes(data);
        setDisplayPrevious(true);
      }

      setFetchNotes(false);
    };

    if (fetchNotes) {
      fetchPreviousNotes();
    }
  }, [id, fetchNotes]);

  function openFullScreen(note) {
    setFullScreenNote(note);
  }

  function closeFullScreen(note) {
    setFullScreenNote(null);
  }

  return (
    <>
      <Navbar user={user} setBackground={setBackground} id={id} />
      <div className="NOTES">
        <div className="notes-grid">
          <div
            className="add-note"
            onClick={() => {
              setDisplayNewNote(true);
              setFullScreenNote(null);
            }}
          >
            Add a new Note!
          </div>
          <div className="note-all-notes">
            {displayPrevious &&
              previousNotes.map((note) => (
                <IndividualNotes
                  details={note}
                  key={note._id}
                  openFullScreen={openFullScreen}
                  closeFullScreen={closeFullScreen}
                  setFullScreenNote={setFullScreenNote}
                />
              ))}
          </div>
        </div>
        <div
          className="note-fullscreen"
          style={{ backgroundImage: `url(${background})` }}
        >
          {displayNewNote && (
            <Note
              setDisplayNewNote={setDisplayNewNote}
              title={title}
              body={body}
              setTitle={setTitle}
              setBody={setBody}
              id={id}
              setFetchNotes={setFetchNotes}
            />
          )}
          {fullScreenNote && (
            <NoteFullScreen
              note={fullScreenNote}
              closeFullScreen={closeFullScreen}
              checkOpen={displayNewNote}
              closeNew={setDisplayNewNote}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Notes;
