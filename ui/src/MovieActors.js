import { useMemo, useState } from "react";

export default function MovieActors({
  movie,
  allActors,
  onAssignActor,
  onUnassignActor,
}) {
  const [selectedActorId, setSelectedActorId] = useState("");

  const assignedIds = useMemo(
    () => new Set((movie.actors || []).map((a) => a.id)),
    [movie.actors]
  );

  const availableActors = allActors.filter((a) => !assignedIds.has(a.id));

  return (
    <div style={{ marginTop: 8 }}>
      <div>
        <select
          value={selectedActorId}
          onChange={(e) => setSelectedActorId(e.target.value)}
        >
          <option value="">— wybierz aktora —</option>
          {availableActors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} {a.surname}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!selectedActorId}
          onClick={() => {
            onAssignActor(movie.id, Number(selectedActorId));
            setSelectedActorId("");
          }}
          style={{ marginLeft: 10 }}
        >
          Przypisz
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Aktorzy w filmie:</strong>
        <ul>
          {(movie.actors || []).map((a) => (
            <li key={a.id}>
              {a.name}
              <button
                type="button"
                onClick={() => onUnassignActor(movie.id, a.id)}
                style={{ marginLeft: 10 }}
              >
                Usuń z filmu
              </button>
            </li>
          ))}
          {(movie.actors || []).length === 0 && <li>brak</li>}
        </ul>
      </div>
    </div>
  );
}