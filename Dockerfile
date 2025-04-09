FROM postgres

WORKDIR usr/src/app

EXPOSE 5432

# start the PostgreSQL server
CMD ["postgres"]
