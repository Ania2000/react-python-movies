export default function ActorsList({ actors, onDeleteActor }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Actors in this movie</h2>

      {actors.length === 0 ? (
        <p>No actors yet</p>
      ) : (
        <ul>
          {actors.map((actor) => (
            <li key={actor.id}>
              {actor.name} {actor.surname}

              <button
                type="button"
                onClick={() => onDeleteActor(actor.id)}
                style={{ marginLeft: 10 }}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}