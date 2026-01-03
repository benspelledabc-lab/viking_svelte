# put ENV files in place...
aws s3 cp s3://spelledabc-asg-spot/toolbox/viking/env/svelte.env /workspace/svelte_ui/.env
aws s3 cp s3://spelledabc-asg-spot/toolbox/viking/env/flask.env /workspace/flask_api/.env

git pull
docker-compose down && docker-compose up --build -d
