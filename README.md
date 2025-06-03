# CSV Translation Tool

🌍 **Web app** for semi-automatic CSV translation | **AI-assisted** (MarianMT) + **human validation**  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
## Table of contents
  - [Features](#feature)
  - [Tech Stack](#tech_stack)
  - [Prerequisites](#prerequisites)
  - [Quick start](#quick_start)
  - [Linting and formating](#linting_formating)
  - [Documentation](#documentation) or just go [Here](https://kerciu.github.io/csv-translation-tool/)
  - [Testing](#testing)
  - [Screenshots](#screenshots)

![](docs/screenshots/HomePage.png)

![](docs/screenshots/TranslationExampleCut.png)

<a name="feature"></a>
## Key Features  

| Feature | Description |  
|---------|-------------|  
| **📁 File Processing** | CSV upload, column/row selection, data validation |  
| **🤖 Smart Translation** | MarianMT (Rust-powered), error highlighting, Redis caching |  
| **🔒 User Auth** | JWT/OAuth2 login with session persistence (MongoDB) |  
| **🚀 Export** | Download translated files |  

<a name="tech_stack"></a>
## Tech Stack

<table>
  <tr>
    <td width="20%">
      <h3 align="center">Frontend</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs&logoColor=white" alt="Next.js">
        <img src="https://img.shields.io/badge/React-%2361DAFB?logo=react&logoColor=white" alt="React">
        <img src="https://img.shields.io/badge/TypeScript-%233178C6?logo=typescript&logoColor=white" alt="TypeScript">
        <br>
        <img src="https://img.shields.io/badge/Tailwind_CSS-%2338B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
        <img src="https://img.shields.io/badge/shadcn/ui-%23000000?logo=ui" alt="shadcn/ui">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Backend</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Django-%23092E20?logo=django&logoColor=white" alt="Django">
        <img src="https://img.shields.io/badge/Django_REST-%23FF1700?logo=django&logoColor=white" alt="Django REST">
        <img src="https://img.shields.io/badge/Python-%233776AB?logo=python&logoColor=white" alt="Python">
        <img src="https://img.shields.io/badge/JWT-%23000000?logo=json-web-tokens&logoColor=white" alt="JWT">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">AI/ML</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Rust-%23000000?logo=rust&logoColor=white" alt="Rust">
        <img src="https://img.shields.io/badge/PyO3-%23FFD43B?logo=python&logoColor=white" alt="PyO3">
        <img src="https://img.shields.io/badge/MarianMT-%23000000?logo=huggingface&logoColor=white" alt="MarianMT">
        <img src="https://img.shields.io/badge/Hugging_Face-%23FFD21E?logo=huggingface&logoColor=black" alt="Hugging Face">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Data</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/MongoDB-%2347A248?logo=mongodb&logoColor=white" alt="MongoDB">
        <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" alt="Redis">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Infrastructure</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Docker-%232496ED?logo=docker&logoColor=white" alt="Docker">
        <img src="https://img.shields.io/badge/GitHub_Actions-%232088FF?logo=github-actions&logoColor=white" alt="GitHub Actions">
        <img src="https://img.shields.io/badge/Postman-%23FF6C37?logo=postman&logoColor=white" alt="Postman">
      </p>
    </td>
  </tr>
</table>


<a name="prerequisites"></a>
## Prerequisites
  - [Python](https://www.python.org/downloads/) (<13v, 12v recommended)
  - [Docker](https://www.docker.com/) (latest stable version)
  - [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
  - [Node.js](https://nodejs.org/) (v16+ recommended)
  - [npm](https://www.npmjs.com/) (comes with Node.js)

<a name="quick_start"></a>
## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kerciu/csv-translation-tool.git
   cd csv-translation-tool

2. **Open installed docker's desktop application**

3. **Build docker**
   ```bash
    docker-compose build
   ```

4. **Run docker**
   ```bash
    docker-compose up
   ```
5. **Go to site**
   You can now go to http://localhost:3000 and enjoy our app.
   Try uploading from test_data catalog example.csv to test it yourself!


<a name="linting_formating"></a>
## Linting and formating
  - [pre-commit](https://pre-commit.com) for automatic coding style verification and formating
  - ***python***: flake8, black, isort
  - ***react***: ESlint, Prettier
  - ***rust***:  clippy, fmt
### To run
  #### Python-react
```bash
  pip install -r requirements-dev.txt
  pre-commit install
  pre-commit run --all-files
```
  #### Rust
```bash
  cd model
  cargo fmt
  cargo clippy
```
<a name="documentation"></a>
## Documentation 
### Python or just go [Here](https://kerciu.github.io/csv-translation-tool/)
- **REST API**: ***Swagger*** - you can see it by running the application and going to [here](http://127.0.0.1:8000/swagger/)
- **Models, Serializers, Utils**: ***docstrings + [Sphinx](https://www.sphinx-doc.org/en/master/)*** - to run:
    1. #### Install all dependencies
      pip install -r requirements-dev.txt
    2. #### Go to docs folder in server
      cd server
      cd docs
    3. #### Based on your system use make file
    **Linux**:
    ```bash
    make html
    ```

  
    **Windows:**
    ```bash
    .\make.bat html
    ```

    4. #### To see it open in your browser build/html/index.html or use this commend
    **Linux:**
    ```bash
    cd .\build\html\
    start index.html
    ```

  
    **Windows:**
    ```bash
    cd .\build\html\
    Start-Process index.html
    ```
<a name="testing"></a>
## Testing

### Python
1. **Run docker**
```bash
docker-compose up
```
2. **Start translator-model container's bash**
```bash
  docker exec -it translator-server bash
```
3. **Run tests**
```bash
  python manage.py test
```

### Rust
1. **Go to model folder**
```bash
cd model
```
2. **Run tests (keep in mind you should have Redis server working on port 6379)**
```bash
cargo test
```

## Screenshots

<p align="center">
  <img src="docs/screenshots/HomePage.png" width="600"/><br/>
  <em>Home Page</em>
</p>

<p align="center">
  <img src="docs/screenshots/SignDialogCut.png" width="600"/><br/>
  <em>Sign Dialog</em>
</p>

<p align="center">
  <img src="docs/screenshots/DashboardPage.png" width="600"/><br/>
  <em>Dashboard Page</em>
</p>

<p align="center">
  <img src="docs/screenshots/TipsDialogCut.png" width="600"/><br/>
  <em>Tips Dialog</em>
</p>

<p align="center">
  <img src="docs/screenshots/TranslationExampleCut.png" width="600"/><br/>
  <em>Translation Example</em>
</p>

## Contact
For questions, feedback, or support:
- **Authors**: Kacper Górski, Szymon Kamiński
- **LinkedIn**: [Kacper Górski](https://www.linkedin.com/in/kacper-gorski-se), [Szymon Kamiński](https://www.linkedin.com/in/kacper-gorski-se)
- **GitHub**: [Kerciu](https://github.com/Kerciu), [Szymon](https://github.com/Kerciu)
- **Email**: [kacper.gorski.contact@gmail.com](mailto:kacper.gorski.contact@gmail.com), [kacper.gorski.contact@gmail.com](mailto:kacper.gorski.contact@gmail.com)
