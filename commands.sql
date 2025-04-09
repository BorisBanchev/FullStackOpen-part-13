CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Juho', 'juho.me', 'Biography', 4);
INSERT INTO blogs (url, title, likes) VALUES ('Hello.com', 'Hello World!', 100);