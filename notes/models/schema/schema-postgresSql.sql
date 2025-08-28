CREATE TABLE IF NOT EXISTS notes(
    notekey VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    body TEXT,
    PRIMARY KEY(notekey)
);