## Contributions

### Kacper Górski (331379)

- **Frontend**
  - Implemented complete frontend in **React (TypeScript) + Next.js**
  - Styled the UI using **Tailwind CSS** and **shadcn/ui**
  - Created upload system and custom CSV parser (column/row selection)
  - Developed full **translation editing interface**, session views, and status tracking
  - Added keyboard shortcuts, validation, and error display

- **Machine Learning Module**
  - Created translation module in **Rust using Candle**
  - Converted HuggingFace MarianMT PyTorch model to **safetensors**
  - Wrote Maturin bridge for PyO3 ↔ Python backend communication

- **DevOps / System Integration**
  - Wrote **Docker** configuration (frontend, backend, ML module, DB, Redis)
  - Configured **CI/CD** for **linting**, **testing** and **formatting** purposes

### Szymon Kamiński (331387)

- **Backend**
  -Implemented complete backend in **Python-django**
  -Made **JWT token** authorization and **OAuth2 Google and Github** authorization
  -Implemented .csv files processing
  -Made whole database with users and files models
  -Implemented atomic asynchronus database updating 
- **Integration**
  -Integrated **backend** and **frontend**
- **DevOps/Documentation**
  - Wrote and implemented **Pre-commit hook** for automatic formating and styling commits
  - Configurted **CI/CD** for documentation
  - Implemented **Swagger** REST api documentation for backend
  - Implemented **Sphinx** documentation for backend
  - Wrote README.md docummentation and whole **user** guide

---