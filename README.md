# CALAMATCHA CHAT FRONTEND 

[![My Skills](https://skillicons.dev/icons?i=vite,react,ts,tailwind&theme=light)](https://skillicons.dev)

## Stack

- **_Vite + React Typescript_**
- **_Tailwind CSS_**
- **_Firebase_**

## Contents

- [Getting started](#1)
- [Project structure](#2)

## <a name="1"></a>Getting started

### Prerequisites

Please make sure you have the following software installed on your machine:

- **[Nodejs](https://nodejs.org/en/download)** (**v18x** or higher is required)
- **[Visual Studio Code](https://code.visualstudio.com/download)**

### Installation

1. Clone the repository: `git clone <repository_url>`
2. Create your local `.env` file and add `VITE_BASE_URL` variable

## Usage

### Run the project in Development Mode:

### `npm install`

Install all dependencies

### `npm run dev`

Runs the app in the development mode.\
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Run the project in Production Mode:

### `npm build`

## <a name="2"></a>Project structure

- App

  - **public/** public assets folder
    - **assets/** assets folder
  - **src/** source code folder
    - **components/** components folder
    - **config/** config folder
    - **hooks/** custom react hooks folder
    - **layouts/** layouts folder
    - **pages/** pages folder
    - **routes/** routes folder
    - **utils/** utility helper functions folder
    - **App.tsx** main _.jsx_ App
    - **main.tsx** main root _.jsx_
  - **index.html** call the _main.jsx_ file

- Scripts & configuration files
  - **package.json** _npm_ options & scripts
  - **.env.example** example of _.env_ (require to be updated regularly when there are changes on _.env_)
  - **tailwind.config.js** contain the configuration for _Tailwind CSS_
  - **postcss.config.js** contain the configuration for _Tailwind Post CSS_
  - **vite.config.ts** contain the configuration for _Vite_
  - **.editorconfig** contain editorconfig for _node.js_ (require to install EditorConfig for VS Code extension)
  - **.eslintrc.cjs** contain eslint configuration
