## Setting Up the `.env` File

To configure your environment variables, create a `.env` file in the root of your project and add the following lines:

```env
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### Steps:
1. Create a file named `.env` in the root directory of your project.
2. Copy and paste the above variables into the `.env` file.
3. Replace `your_database_name`, `your_database_user`, and `your_database_password` with your actual database credentials.

Ensure that your `.env` file is included in your `.gitignore` to prevent sensitive information from being committed to version control.