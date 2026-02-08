import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
  return (
    <div>
      <ul className="movies-list">
        {props.movies.map((movie) => (
          <li key={movie.id}>
            <MovieListItem
              movie={movie}
              onDelete={() => props.onDeleteMovie(movie.id)}
              allActors={props.allActors}
              onAssignActor={props.onAssignActor}
              onUnassignActor={props.onUnassignActor}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
