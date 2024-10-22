# API Routes

## User Routes

### POST /user/login

- **Input**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Output**:

  - Success:

    ```json
    {
      "success": true,
      "message": "string",
      "data": {
        "token": "string"
      }
    }
    ```

    _Note: This route automatically sets a cookie "token" for subsequent requests._

  - Failure:
    ```json
    {
      "success": false,
      "message": "string",
      "data": "ZodIssue[]"
    }
    ```

### POST /user/register

- **Input**:
  ```json
  {
    "email": "gerki@gmail.com",
    "password": "123456pass",
    "confirmPassword": "123456pass",
    "name": "gerison name"
  }
  ```
- **Output**:

  - Failure:

    ```json
    {
      "success": false,
      "message": "string",
      "data": "ZodIssue[]"
    }
    ```

  - Success:
    ```json
    {
      "success": true,
      "message": "Your account has been created successfully.",
      "data": {
        "id": 2,
        "email": "gerkim62@gmil.com",
        "name": "gerison",
        "role": "SELLER",
        "createdAt": "2024-10-22T13:35:52.020Z",
        "updatedAt": "2024-10-22T13:35:52.020Z"
      }
    }
    ```
    _Note: The returned details correspond to the DB schema and may change. Check the Prisma schema for updates._

### POST /user/logout

- **Input**: None
- **Output**:
  ```json
  {
    "success": true,
    "message": "You have been logged out.",
    "data": null
  }
  ```
  _Note: This route invalidates the token cookie. [Why use POST instead of GET?](https://stackoverflow.com/questions/3521290/logging-out-get-or-post)_

### GET /user/me

- **Input**: None
- **Output**:

  - If logged in:

    ```json
    {
      "success": true,
      "message": "string",
      "data": {
        "id": 2,
        "email": "gerkim62@gmil.com",
        "name": "gerison",
        "role": "SELLER",
        "createdAt": "2024-10-22T13:35:52.020Z",
        "updatedAt": "2024-10-22T13:35:52.020Z"
      }
    }
    ```

  - If logged out:
    ```json
    {
      "success": false,
      "message": "string",
      "data": null
    }
    ```
