from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie = models.Movie.create(**movie.dict())
    return movie


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    return db_movie

@app.get("/actors", response_model=List[schemas.Actor])
def get_actors():
    return list(models.Actor.select())

@app.post("/actors", response_model=schemas.Actor)
def add_actor(actor: schemas.ActorBase):
    db_actor = models.Actor.create(**actor.dict())
    return db_actor

@app.delete("/actors/{actor_id}")
def delete_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    db_actor.delete_instance(recursive=True)
    return {"ok": True}

def movie_with_actors(movie: models.Movie):
    actors = [
        {"id": ma.actor.id, "name": ma.actor.name}
        for ma in models.MovieActor.select().where(models.MovieActor.movie == movie)
    ]
    return {"id": movie.id, "title": movie.title, "year": movie.year, "actors": actors}

@app.post("/movies/{movie_id}/actors/{actor_id}", response_model=schemas.Movie)
def assign_actor(movie_id: int, actor_id: int):
    movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    movie.actors.add(actor)

    movie = models.Movie.get_by_id(movie_id)
    return movie

@app.delete("/movies/{movie_id}/actors/{actor_id}", response_model=schemas.Movie)
def unassign_actor(movie_id: int, actor_id: int):
    movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    movie.actors.remove(actor)

    movie = models.Movie.get_by_id(movie_id)
    return movie 

