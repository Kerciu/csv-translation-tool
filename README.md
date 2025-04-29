# CSV Translation Tool

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack web application for semi-automatic translation of text sets in CSV format, combining machine learning with user manual validation.

## Key Features

- **File Processing**
  - CSV upload/parsing with column/row selection
  - Data visualization and validation
- **Smart Translation**
  - MarianMT-based translations (Rust for blazingly fast performance)
  - Error highlighting and correction interface
  - Translation memory via Redis caching
- **User Experience**
  - JWT/OAuth2 authentication
  - Keyboard shortcuts
  - Session persistence (MongoDB)
- **Export**
  - Download translated files

## Tech Stack

**Frontend**:  
React (TypeScript) + Next.js · Tailwind CSS · shadcn/ui  

**Backend**:  
Django (Python) · PyO3 (Rust integration)  

**Data**:  
MongoDB · Redis  

**Translation**:  
MarianMT transformer · Hugging Face  

## Installation

```bash
git clone https://github.com/Kerciu/csv-translation-tool.git

## More will come in the future, when docker will be set up
```

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