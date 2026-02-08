import { useState } from "react";
import LoadingButtons from "./LoadingButtons"; 

export default function ActorForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  


  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim().length < 2 || surname.trim().length < 2) {
      alert("Imię i nazwisko są za krótkie");
      return;
    }

    onSubmit({
      name: name.trim(),
      surname: surname.trim()
    });

    setName("");
    setSurname("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add actor</h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
<LoadingButtons type="submit" loading={loading}>
  Add
</LoadingButtons>
    </form>
  );
}