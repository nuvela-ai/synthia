# Synthia

Synthia is a project that integrates a Model Context Protocol (MCP) server built with Python and a React-based dashboard for configuring and managing academic research projects.

## Project Structure

- **server/**: Contains the MCP server implementation.
  - `main.py`: Entry point for the MCP server, implementing tools such as `project-init`, `suggest-fragment`, `save-fragment`, and `generate-citations`.

- **dashboard/**: Contains the React application for project management.
  - `src/`: Source code for the React app.
    - `index.js`: Entry point for the React application.
    - `App.js`: Main application component.
    - `components/`: Directory for React components.
      - `ProjectConfig.js`: Component for configuring projects.
      - `ProjectList.js`: Component for listing projects.
    - `assets/`: Directory for static assets.
      - `styles/`: Directory for CSS files.
        - `App.css`: Basic styling for the application.
  - `public/`: Public assets for the React app.
    - `index.html`: HTML template for the React application.

## Getting Started

### MCP Server

1. **Navigate to the server directory:**
```bash
cd server
```

2. Install dependencies:
Ensure you have Python 3.9 or higher installed. Install necessary packages:

```bash
pip install -r requirements.txt
```

3 Run the MCP server:

```bash
python server.py
```

4 Run using FastAPI instead
```bash
python server.py API
```

### React Dashboard

1. Navigate to the dashboard directory:

```bash
cd dashboard
```

2. Install dependencies:
Ensure you have Node.js and npm installed. Install the React app dependencies:


```bash
npm install
```

3. Start the React application:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
