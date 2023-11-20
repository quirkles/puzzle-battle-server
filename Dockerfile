FROM redis/redis-stack:latest
EXPOSE 6379
EXPOSE 8000
RUN ["redis-cli", "FT.CREATE lpr_idx ON HASH PREFIX 1 USER: SCHEMA lichessPuzzleRating NUMERIC"]
CMD ["/entrypoint.sh"]
