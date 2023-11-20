FROM redis/redis-stack:latest
EXPOSE 6379
EXPOSE 8000
CMD ["/entrypoint.sh"]
