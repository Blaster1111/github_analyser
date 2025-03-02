**Gitlyser** (gitlyser.netlify.app)
================

**Project Title** 🚀  
Gitlyser is a comprehensive GitHub repository analyzer that provides detailed insights into repository structure, code quality, and patterns. It offers features such as repository analysis, file analysis, and smart recommendations to improve code.

**Description** 📖 
Gitlyser is designed to help developers and repository owners understand their codebase better, identify areas for improvement, and optimize their development workflow. With its advanced analysis capabilities, Gitlyser empowers users to make data-driven decisions and enhance the overall quality of their repositories.

**Features** ✅ 
*   **Repository Analysis**: Analyze the overall structure and content of a GitHub repository.
*   **File Analysis**: Examine specific files within a repository for detailed code review.
*   **Smart Recommendations**: Receive AI-powered suggestions to improve code quality and structure.
*   **README Generation**: Automatically generate a professional README file for a repository.

**Technologies Used** 🛠️ 
*   **Frontend**: Built using React, TypeScript, and Vite.
*   **Backend**: Powered by FastAPI and Selenium.
*   **Database**: None (uses GitHub API for data retrieval).
*   **APIs/Libraries**: Utilizes OpenRouter API for AI-powered analysis and GitHub API for repository data.

**Installation** 💾 
To run the application locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/your-username/gitlyser.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Usage Guide** 🔍 
1.  Visit the Gitlyser website and enter a GitHub repository URL to analyze.
2.  Choose the type of analysis: repository or file.
3.  Review the analysis results and follow the recommendations to improve code quality.

**API Documentation** 📡 
| Endpoint | Method | Description |
| --- | --- | --- |
| `/analyze-repo` | `POST` | Analyze a GitHub repository. |
| `/analyze-file` | `POST` | Analyze a specific file within a repository. |
| `/generate-readme` | `POST` | Generate a README file for a repository. |

**Project Structure** 📂 
The project consists of the following key files and directories:

*   `client`: Frontend code (React, TypeScript, Vite).
*   `fastApi`: Backend code (FastAPI, Selenium).
*   `server`: Server-side code (Express, Node.js).
*   `utils`: Utility functions and helpers.

**Contributing** 🤝 
Contributions are welcome! To contribute to Gitlyser, please:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Submit a pull request with a clear description of your changes.

**License** 📄 
Gitlyser is licensed under the MIT License. See [LICENSE](LICENSE) for details.
