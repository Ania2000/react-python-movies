import MovieActors from "./MovieActors";

export default function MovieListItem({
  movie,
  onDelete,
  allActors,
  onAssignActor,
  onUnassignActor
}) {
  return (
    <div>
      <div>
        <strong>{movie.title}</strong> ({movie.year})

        <button
          type="button"
          onClick={onDelete}
          style={{ marginLeft: 10 }}
        >
          Usuń film
        </button>
      </div>

      <MovieActors
        movie={movie}
        allActors={allActors}
        onAssignActor={onAssignActor}
        onUnassignActor={onUnassignActor}
      />
    </div>
  );
}
