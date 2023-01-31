### # Table of Content
- Installation
- How to build and deploy to production

#### # Installation
- copy `.env.example` to `.env`
- copy `.env.example` to `.env.production`
  - make sure the API_URL is set to `https://api.upy.moe` _(not the local ip)_
- `yarn install`
- `yarn dev`

#### # Build & Deploy
- go to `build` branch
  ```
  git branch build
  git switch build
  ```
- build app
  ```
  chmod +x ./build.sh
  ./build.sh
  ```
- now you can commit the `.output` folder
  ```
  git add .output # force add if ignored by .gitignore: git add -f --add .output
  git commit -m "build"
  git push origin build
  ```
- it will automatically deployed by github action
- it's better to check the action log to make sure the deployment process is success and no error occured
