# @Author Futa Nakayama
cd /home/ec2-user/TeamF

make docker/stop

docker image rm $(docker image ls -a -q)

docker volume rm teamf_data-volume

make docker/run