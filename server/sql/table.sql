 create table users(
    id serial primary key, 
    first_name varchar(250),
    last_name varchar(250),
    username varchar(250), 
    password varchar(250), 
    favorite_movies varchar []
);