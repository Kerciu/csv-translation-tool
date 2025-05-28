# CSV Translation Tool

🌍 **Web app** for semi-automatic CSV translation | **AI-assisted** (MarianMT) + **human validation**  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  

## Key Features  

| Feature | Description |  
|---------|-------------|  
| **📁 File Processing** | CSV upload, column/row selection, data validation |  
| **🤖 Smart Translation** | MarianMT (Rust-powered), error highlighting, Redis caching |  
| **🔒 User Auth** | JWT/OAuth2 login with session persistence (MongoDB) |  
| **🚀 Export** | Download translated files |  

## Tech Stack

<table>
  <tr>
    <td width="20%">
      <h3 align="center">Frontend</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&logoColor=white" alt="Next.js">
        <img src="https://img.shields.io/badge/React-18.2-%2361DAFB?logo=react&logoColor=white" alt="React">
        <img src="https://img.shields.io/badge/TypeScript-5.0-%233178C6?logo=typescript&logoColor=white" alt="TypeScript">
        <br>
        <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-%2338B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
        <img src="https://img.shields.io/badge/shadcn/ui-0.5-%23000000?logo=ui" alt="shadcn/ui">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Backend</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Django-4.2-%23092E20?logo=django&logoColor=white" alt="Django">
        <img src="https://img.shields.io/badge/Django_REST-3.14-%23FF1700?logo=django&logoColor=white" alt="Django REST">
        <img src="https://img.shields.io/badge/Python-3.11-%233776AB?logo=python&logoColor=white" alt="Python">
        <img src="https://img.shields.io/badge/JWT-%23000000?logo=json-web-tokens&logoColor=white" alt="JWT">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">AI/ML</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Rust-1.70-%23000000?logo=rust&logoColor=white" alt="Rust">
        <img src="https://img.shields.io/badge/PyO3-0.20-%23FFD43B?logo=python&logoColor=white" alt="PyO3">
        <img src="https://img.shields.io/badge/MarianMT-%23000000?logo=huggingface&logoColor=white" alt="MarianMT">
        <img src="https://img.shields.io/badge/Hugging_Face-%23FFD21E?logo=huggingface&logoColor=black" alt="Hugging Face">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Data</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/MongoDB-7.0-%2347A248?logo=mongodb&logoColor=white" alt="MongoDB">
        <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" alt="Redis">
      </p>
    </td>
    <td width="20%">
      <h3 align="center">Infrastructure</h3>
      <p align="center">
        <img src="https://img.shields.io/badge/Docker-24.0-%232496ED?logo=docker&logoColor=white" alt="Docker">
        <img src="https://img.shields.io/badge/GitHub_Actions-%232088FF?logo=github-actions&logoColor=white" alt="GitHub Actions">
        <img src="https://img.shields.io/badge/Postman-%23FF6C37?logo=postman&logoColor=white" alt="Postman">
      </p>
    </td>
  </tr>
</table>

## Prerequisites

- [Python](https://www.python.org/downloads/) ( < 13, v12 Recommended)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [cURL](https://curl.se/)


## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://gitlab-stud.elka.pw.edu.pl/kgorski1/zpr_25l
   cd zpr_25l

2. **Run the application**
   ```bash
    run.bat

   # More will come when docker will be set up
   ```
