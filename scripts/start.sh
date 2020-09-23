cd /home/ec2-user/TeamF

make docker/stop

make docker/run

make flyway/clean

make flyway/baseline

make flyway/migrate