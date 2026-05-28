# Local dev Postgres — init SQL is copied into the image so Docker does not need
# file-sharing access to /Applications (common macOS Docker Desktop restriction).
FROM pgvector/pgvector:pg16

COPY init/*.sql /docker-entrypoint-initdb.d/
