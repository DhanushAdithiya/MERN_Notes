import React, { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./notes.css";
import ReactMarkdown from "react-markdown";

function logOutUser(navigate) {
  localStorage.removeItem("token");
  navigate("/");
}

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
      <h1>{details.title}</h1>
      <ReactMarkdown className="md" children={processedMarkdown} />
    </div>
  );
};

const NoteFullScreen = ({ note, closeFullScreen }) => {
  const headingRef = useRef(null);
  const contentRef = useRef(null);

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
        <h1
          className="note-full-heading"
          onClick={editableElement}
          ref={headingRef}
        >
          {note.title}
        </h1>

        <textarea
          className="text-area-note"
          ref={contentRef}
          defaultValue={note.body}
          contentEditable="true"
        ></textarea>
      </div>
      <div className="note-full-action">
        <input type="submit" value={"SaveNote"} onClick={patchNote} />
        <input type="submit" value={"Close Note"} onClick={closeFullScreen} />
        <input type="submit" value={"Delete Note"} onClick={deleteNote} />
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
      <h1>Hello {user}</h1>
      <h2>{id}</h2>
      <input
        className="btn-submit"
        type="submit"
        value="Logout"
        onClick={() => logOutUser(navigate)}
      />

      <div className="notes_grid">
        <div className="add-note" onClick={() => setDisplayNewNote(true)}>
          +
        </div>
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
        {fullScreenNote && (
          <NoteFullScreen
            note={fullScreenNote}
            closeFullScreen={closeFullScreen}
          />
        )}
      </div>
    </>
  );
};

export default Notes;
