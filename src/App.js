import { useState } from "react";

export default function App() {
  const [duties, setDuties] = useState([]);
  function handleAddDuty(duty) {
    setDuties((duties) => [...duties, duty]);
  }
  function handleDeleteDuty(id) {
    setDuties((duties) => duties.filter((duty) => duty.id !== id));
  }

  function handleToggleDuty(id) {
    setDuties((duties) =>
      duties.map((duty) =>
        duty.id === id ? { ...duty, done: !duty.done } : duty
      )
    );
  }
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all duties?"
    );
    if (confirmed) setDuties([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddDuty={handleAddDuty} />
      <ToDoList
        duties={duties}
        onDeleteDuty={handleDeleteDuty}
        onToggleDuty={handleToggleDuty}
        onClearList={handleClearList}
      />
      <Statistics duties={duties} />
    </div>
  );
}

function Logo() {
  return <h1>To Do List 📝</h1>;
}

function Form({ onAddDuty }) {
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("8:00"); //here needs to be changed because otherwise it doesnt update

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newDuty = { description, time, done: false, id: crypto.randomUUID() };
    onAddDuty(newDuty);
    setDescription("");
    setTime("8:00");
  }
  let timeArray = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to do?🖌</h3>
      <select value={time} onChange={(e) => setTime(e.target.value)}>
        {timeArray.map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="What has to be done..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function ToDoList({ duties, onDeleteDuty, onToggleDuty, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedDuties;
  if (sortBy === "input") sortedDuties = duties;
  if (sortBy === "description")
    sortedDuties = duties
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "done")
    sortedDuties = duties
      .slice()
      .sort((a, b) => Number(a.done) - Number(b.done));
  return (
    <div className="list">
      <ul>
        {sortedDuties.map((duty) => (
          <Duty
            duty={duty}
            key={duty.id}
            onDeleteDuty={onDeleteDuty}
            onToggleDuty={onToggleDuty}
          />
        ))}
      </ul>
      <div>
        <select
          className="btnActions"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="done">Sort by done status</option>
        </select>
        <button className="btnActions" onClick={onClearList}>
          Clear list
        </button>
      </div>
    </div>
  );
}

function Duty({ duty, onDeleteDuty, onToggleDuty }) {
  return (
    <li>
      <input
        type="checkbox"
        value={duty.done}
        onChange={() => {
          onToggleDuty(duty.id);
        }}
      />
      <span style={duty.done ? { textDecoration: "line-through" } : {}}>
        {duty.description} {duty.time}
      </span>
      <button onClick={() => onDeleteDuty(duty.id)}>❌</button>
    </li>
  );
}

function Statistics({ duties }) {
  if (!duties.length)
    return (
      <p className="stats">
        <em>Add your duties to the list🗒</em>
      </p>
    );
  const numDuties = duties.length;
  const numDone = duties.filter((duty) => duty.done).length;
  const percentage = Math.round((numDone / numDuties) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You did everything! Now you can rest 🏝"
          : `You have ${numDuties} items on your list, and you already done ${numDone}
        (${percentage} %)`}
      </em>
    </footer>
  );
}
