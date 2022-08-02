DROP TABLE IF EXISTS tracker, users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT
);

CREATE TABLE tracker(
    company TEXT,
    applied TEXT,
    interview TEXT,
    TC_offer INTEGER,
    id INTEGER NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY(id)
    REFERENCES users(id)
);