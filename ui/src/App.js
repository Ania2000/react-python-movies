import './App.css';
import { useState, useEffect } from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [actors, setActors] = useState([]);
    const [addingActorLoading, setAddingActorLoading] = useState(false);
    const [addingMovieLoading, setAddingMovieLoading] = useState(false);


    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };

        const fetchActors = async () => {
            const response = await fetch(`/actors`);
            if (response.ok) setActors(await response.json());
        };

        fetchMovies();
        fetchActors();
    }, []);

    async function handleAddMovie(movie) {
        setAddingMovieLoading(true);
        try {
            const response = await fetch('/movies', {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                toast.error("Failed to add movie");
                return;
            }

            const savedMovie = await response.json();
            setMovies((prev) => [...prev, savedMovie]);
            setAddingMovie(false);

            toast.success("Movie added");
        } catch (e) {
            toast.error("Server connection error");
        } finally {
            setAddingMovieLoading(false);
        }
    }
    async function handleDeleteMovie(movieId) {
        const response = await fetch(`/movies/${movieId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setMovies((prev) => prev.filter((m) => m.id !== movieId));
            toast.success("Movie deleted");
        } else {
            toast.error("Failed to delete movie");
        }
    }
    async function handleAddActor(actor) {
        setAddingActorLoading(true);
        try {
            const response = await fetch("/actors", {
                method: "POST",
                body: JSON.stringify(actor),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                toast.error("Failed to add actor");
                return;
            }

            const saved = await response.json();
            setActors((prev) => [...prev, saved]);

            toast.success("Actor added");
        } catch {
            toast.error("Server connection error");
        } finally {
            setAddingActorLoading(false);
        }
    }
    async function handleDeleteActor(actorId) {
        const response = await fetch(`/actors/${actorId}`, { method: "DELETE" });

        if (response.ok) {
            setActors((prev) => prev.filter((a) => a.id !== actorId));

            setMovies((prev) =>
                prev.map((m) => ({
                    ...m,
                    actors: (m.actors || []).filter((a) => a.id !== actorId),
                }))
            );
        }
    }

    async function handleAssignActor(movieId, actorId) {
        const response = await fetch(`/movies/${movieId}/actors/${actorId}`, {
            method: "POST",
        });

        if (response.ok) {

            const updatedMovie = await response.json();
            setMovies((prev) => prev.map((m) => (m.id === movieId ? updatedMovie : m)));
        }
    }

    async function handleUnassignActor(movieId, actorId) {
        const response = await fetch(`/movies/${movieId}/actors/${actorId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            const updatedMovie = await response.json();
            setMovies((prev) => prev.map((m) => (m.id === movieId ? updatedMovie : m)));
        }
    }



    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>

            <div className="layout">

                {/* LEWA KOLUMNA — AKTORZY */}
                <div className="left-column">
                    <h2>Actors</h2>

                    <ActorForm
                        onSubmit={handleAddActor}
                        loading={addingActorLoading}
                    />

                    <ActorsList
                        actors={actors}
                        onDeleteActor={handleDeleteActor}
                    />
                </div>

                {/* PRAWA KOLUMNA — FILMY */}
                <div className="right-column">
                    <h2>Movies</h2>

                    {movies.length === 0 ? (
                        <p>No movies yet. Maybe add something?</p>
                    ) : (
                        <MoviesList
                            movies={movies}
                            onDeleteMovie={handleDeleteMovie}
                            allActors={actors}
                            onAssignActor={handleAssignActor}
                            onUnassignActor={handleUnassignActor}
                        />
                    )}

                    {addingMovie ? (
                        <MovieForm
                            onMovieSubmit={handleAddMovie}
                            buttonLabel="Add a movie"
                            loading={addingMovieLoading}
                        />
                    ) : (
                        <button onClick={() => setAddingMovie(true)}>
                            Add a movie
                        </button>

                    )}
                    <ToastContainer position="bottom-right" />
                </div>

            </div>
        </div>
    );

}

export default App;
