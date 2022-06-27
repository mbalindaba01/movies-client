 create table users(
    id serial primary key, 
    username varchar(250), 
    password varchar(250), 
    favorite_movies varchar []
);