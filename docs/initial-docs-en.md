# Web application for semi-automatic translation of text sets

**Kacper Górski (331379)**
**Szymon Kamiński (331387)**
---
## Project description

The project consists of developing a tool supporting **semi-automatic translation of text sets** in **.csv** format.

The solution is implemented as a **full-stack web application** with a **low-level ML** module for text translation.

## Functionalities

**File handling:**
- Loading CSV files (with the possibility of expanding to other formats)
- File parsing and data visualization
- Selecting columns for translation
- Selecting the range of rows for translation

**Translation:**
- Selecting the initial and target natural language
- Automatic translation suggestion
- Visibly displayed errors detected during translation
- Dialog allowing the user to make translation corrections

**User interaction:**
- Authentication via JWT and OAuth2 tokens
- Keyboard shortcut support
- Ability to resume the translation process after restarting the application (saving progress in the database)

**Exporting results:**
- Downloading a file with translated text

## Technological assumptions

The frontend was implemented using the **React (TypeScript)** framework with **Next.js**. **Tailwind CSS** and the **shadcn/ui** component library were used to provide a modern look for the application.

The backend was implemented in **Python** using the **Django** framework. It is responsible for data validation, **REST API** and user authentication using **JWT and OAuth2**.

The translation module is based on the **MarianMT transformer from the Hugging Face** library and was implemented in **Rust** to ensure high translation efficiency, significantly exceeding its Python counterparts. **PyO3** was used to integrate this module with the backend.

User data and information necessary to resume translations are stored in the **MongoDB** database, chosen for its flexible data structure.

**Redis** was used to cache translations (and potentially models), which significantly shortens the waiting time for results.

As time permits, the following is also planned:

- containerization of applications using **Docker**

- preparation of **CI/CD pipelines**

## Time and subproblems cost estimate

| **Task** | **Time (est.)** |
|---|---|
| **Project analysis and preparation** | **10h** |
| Selection of technology stack, functionality plan | 3h |
| Documentation, division of roles, repository, work plan | 7h |
| Initial modeling of the appearance of the document database | 6h |
| **Backend (Django + PyO3)** | **50h** |
| Authorization (JWT + OAuth2), session handling | 6h |
| CSV file handling and validation | 6h |
| REST API: uploads, sessions, editing interface | 12h |
| Integration with Rust (PyO3) and communication with the ML module | 10h |
| Integration with MongoDB, modeling the database | 6h |
| Integration with Redis, caching translations (and possibly models) | 6h |
| Unit tests implemented using Django test cases | 10h |
| **Translation module (Rust + MarianMT)** | **30h** |
| Loading and optimizing the MarianMT model | 6h |
| Caching mechanism + optimizations | 8h |
| Testing and integration with the backend (PyO3) | 10h |
| **Frontend (React + Next.js + Tailwind)** | **80h** |
| Home page and user authentication windows | 10h |
| Upload system and CSV parser (with column/row selection) | 16h |
| Translation editing interface (with shortcuts, validation) | 24h |
| Session view, translations, editing in a dialog | 10h |
| Export results, translation statuses, progress view | 10h |
| Authorization, routing, API access | 16h |
| Styling and UX (Tailwind + shadcn/ui), responsiveness | 10h |
| **DevOPS (optional if you have time)** | **18h** |
| Containerizing the application using docker | 6h |
| Setting up CI/CD pipelines on Gitlab | 6h |
| Rewriting Gitlab CI/CD to Github Actions | 6h |

**Total project time (without DevOps): 170h**
**Total project time (with DevOps): 188h**

## Summary

The created tool enables fast and semi-automatic translation of text collections thanks to the combination of modern technologies: frontend in React/Next.js, efficient backend in Django, and ML module in Rust using MarianMT.
Thanks to the flexible approach to data (MongoDB + Redis), the user can freely work with large files, edit translations and resume the session.
The project emphasizes user ergonomics, efficiency, and modularity, which makes it a solid solution for translation automation in production and research environments.
