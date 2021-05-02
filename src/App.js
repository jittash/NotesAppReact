import { useEffect, useState } from "react";
import "./styles.css";
import NoteList from "./components/NoteList";
import Navbar from "./components/Navbar";

//get data from local storage
const localNotes = () => {
  if (localStorage.getItem("notes")) {
    return JSON.parse(localStorage.getItem("notes"));
  } else {
    return [];
  }
};

const App = () => {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [notes, setnotes] = useState(localNotes());

  const [addtoggle, setaddtoggle] = useState(true);
  const [toeditid, settoeditid] = useState(null);

  const [searchvalue, setsearchvalue] = useState("");
  const [searchResults, setsearchResults] = useState([]);

  const [dark, setdark] = useState(false);

  const themes = {
    dark: {
      backgroundColor: "black",
      color: "green"
    },
    light: {
      backgroundColor: "white",
      color: "black"
    }
  };

  const addNote = (e) => {
    e.preventDefault();
    //add note
    if (title && description && addtoggle) {
      const note = {
        id: new Date().getTime().toString(),
        title,
        description
      };
      setnotes([...notes, note]);
      settitle("");
      setdescription("");
    }
    //update note
    else if (title && description && !addtoggle) {
      setnotes(
        notes.map((note) => {
          if (note.id === toeditid) {
            return { ...note, title, description };
          }
          return note;
        })
      );
      setaddtoggle(true);
      settitle("");
      setdescription("");
      settoeditid(null);
    } else {
      alert("Fields cannot be empty");
    }
  };
  //Adding note to local storage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  //Delete single note
  const deleteNote = (key) => {
    if (window.confirm("Are you sure to delete?")) {
      const filteredArray = notes.filter((note) => {
        return note.id !== key;
      });
      setnotes(filteredArray);
    }
  };

  //Delete all notes at once
  const deleteAll = () => {
    if (window.confirm("Are you sure to delete?")) {
      setnotes([]);
    }
  };

  //Getting note to edit
  const editNote = (key) => {
    const editItem = notes.find((note) => {
      return note.id === key; //object
    });
    setaddtoggle(false);
    settitle(editItem.title);
    setdescription(editItem.description);
    settoeditid(editItem.id);
  };

  //Search Functionality
  const Search = (params) => {
    //const searchArray = notes.filter((note) => {
    //return note.title.includes(value);
    //});
    setsearchvalue(params);
    if (searchvalue !== 0) {
      const searchList = notes.filter((note) => {
        return Object.values(note)
          .join(" ")
          .toLowerCase()
          .includes(params.toLowerCase());
      });
      setsearchResults(searchList);
    } else {
      setsearchResults(notes);
    }
  };

  //Toggle Theme
  const themeToggler = () => {
    const isDark = !dark;
    localStorage.setItem("theme", JSON.stringify(isDark));
    setdark(isDark);
  };
  const theme = dark ? themes.dark : themes.light;

  return (
    <div className="App container my-3">
      <div
        style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
      >
      <Navbar Search={Search} />
      <h1 className="text-center">Welcome to React Notes App</h1>
      <div className="addNote card">
        <div className="card-body">
          <div className="mb-3">
            <h5 className="card-title">Add Title</h5>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(event) => settitle(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <h5 className="card-title">Add description</h5>
            <textarea
              type="text"
              id="description"
              className="form-control"
              value={description}
              onChange={(event) => setdescription(event.target.value)}
            ></textarea>
          </div>
          {addtoggle ? (
            <button className="btn btn-primary" onClick={addNote}>
              Add Note
            </button>
          ) : (
            <button className="btn btn-primary" onClick={addNote}>
              Edit Note
            </button>
            
          )}
          <button onClick={deleteAll} className="btn btn-danger">
            Clear All
          </button>
          <button
                onClick={themeToggler}
                className="btn"
                style={{
                  background: theme.backgroundColor,
                  color: theme.color
                }}
              >
                Toggle to {!dark ? "dark" : "light"} theme
              </button>
        </div>
      </div>
      <hr />
      <NoteList
        notes={searchvalue.length < 1 ? notes : searchResults}
        editNote={editNote}
        deleteNote={deleteNote}
      />
      </div>
    </div>
  );
};

export default App;
