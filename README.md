# Qoala Server

## Demo

Server hosted on Cyclic: [https://fuzzy-colt-button.cyclic.app/](https://fuzzy-colt-button.cyclic.app/)

## Technologies used

Node, Express, MongoDB and Google Cloud Vision API 

## Run Locally

Clone the project

```bash
  git clone https://github.com/SrirajBehera/qoala-server.git
```

Go to the project directory

```bash
  cd client
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGODB_USERNAME`

`MONGODB_PASSWORD`

`JWT_SECRET`

`TYPE`

`PROJECT_ID`

`PRIVATE_KEY_ID`

`PRIVATE_KEY_BASE64`

`CLIENT_EMAIL`

`CLIENT_ID`

`AUTH_URI`

`TOKEN_URI`

`AUTH_PROVIDER_X509_CERT_URL`

`CLIENT_X509_CERT_URL`

`UNIVERSE_DOMAIN`

## Google Cloud Vision API

Cloud Vision API is used for OCR.

You can read through the official Google [Documentation](https://cloud.google.com/vision/docs/ocr#optical_character_recognition_ocr) for OCR. Apart form the first 4 environment variables, rest are available from GCP once you sign in to GCP, activate Cloud Vision API and generate Application Default Credentials (ADC). You will get JSON file containing the credentials once its keys are generated (follow steps provided in docs).

You have to convert the "private_key" present in the credentials JSON file to Base64 format to store in .env. like this:

```js
// Run this code in a JS file on your Dev Machine.
const privateKey= `-----BEGIN PRIVATE KEY-----\nMIIEvSomeMoreCharacterHererplw==\n-----END PRIVATE KEY-----\n`
const buff = Buffer.from(privateKey).toString('base64');
console.log(buff); // paste this content into .env
```

Note: You don't need to commit/include the above code in your project. This is just to generate the base64 string of the key.

## Dependencies

```json
"dependencies": {
    "@google-cloud/vision": "^4.0.2",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
```

## Architecture Overview

1. Environment Configuration:
    - The application uses the `dotenv` library to load environment variables from a `.env` file.

    - It configures the environment variables needed for the application, such as the server port.

2. Express.js Setup:

    - The code initializes an Express application using `const app = express();`.

3. Database Connection:

    - The `./database` module is required to establish a connection to the MongoDB database.

    - Two models, "User" and "Document," are defined using Mongoose (a MongoDB object modeling tool). These models represent the structure of the documents in the corresponding collections in the MongoDB database.

4. Middleware Configuration:

    - Body parser middleware is configured to parse incoming JSON and URL-encoded data.

    - CORS (Cross-Origin Resource Sharing) middleware is set up to allow requests from any origin ("*") or "your-link" for specific origin.

5. Route Configuration:

    - Authentication routes are defined in `./routes/auth`.

    - Document-related routes are defined in `./routes/document`.

6. Error Handling Middleware:

    - Custom error handling middleware functions (`notFound` and `errorHandler`) are implemented to handle 404 Not Found errors and other application errors.

7. Server Listening:

    - The application listens on the specified port (retrieved from the environment variables) for incoming HTTP requests.

8. Console Output:

    - A message is logged to the console when the server starts, indicating the port on which the server is running.

## API Reference

### Authentication routes defined in `./routes/auth`

### Get Hello Message
- **URL:** `/`
- **Method:** `GET`
- **Description:** Get a hello message from the Qoala server.
- **Response:**
  - Success (200): "HELLO Qoala server!"
  
---

### Register User

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
  - `name` (string): User's name.
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response:**
  - Success (200): 
    - `message`: "User Created Successfully!"
    - `data`: User data.
  - Error (422): 
    - `error`: "Please add all the fields" (if any required field is missing).
    - `error`: "User with that email already exists. Please Sign in." (if the user with the provided email already exists).

---

### User Login

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticate and login a user.
- **Request Body:**
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response:**
  - Success (200): 
    - `token`: JWT token for authentication.
    - `user`: User details (including `_id`, `name`, `email`).
  - Error (422): 
    - `error`: "Please enter email or password" (if email or password is missing).
    - `error`: "Invalid email or password" (if the provided email or password is incorrect).

---

### Document-related routes defined in `./routes/document`

### Get User's Documents

- **URL:** `/mydocs`
- **Method:** `GET`
- **Description:** Get documents created by the authenticated user.
- **Authorization Header:**
  - `Authorization`: Bearer token obtained during login.
- **Response:**
  - Success (200): 
    - `docs`: Array of documents.
  
---

### Get Document by ID

- **URL:** `/mydocs/:docid`
- **Method:** `GET`
- **Description:** Get details of a specific document by its ID.
- **Authorization Header:**
  - `Authorization`: Bearer token obtained during login.
- **Response:**
  - Success (200): 
    - `mydoc_data`: Document details.

---

### Create Document

- **URL:** `/createdoc`
- **Method:** `POST`
- **Description:** Create a new document using OCR from an image link.
- **Authorization Header:**
  - `Authorization`: Bearer token obtained during login.
- **Request Body:**
  - `image_link` (string): URL link to the document image.
- **Response:**
  - Success (200): 
    - `document`: Created document details.
  - Error (422): 
    - `error`: "Document image_link cannot be empty!"

---

### Edit Document

- **URL:** `/editdoc/:docid`
- **Method:** `PUT`
- **Description:** Edit details of a specific document by its ID.
- **Authorization Header:**
  - `Authorization`: Bearer token obtained during login.
- **Request Body:**
  - Document details to be updated (identification_number, name, last_name, date_of_birth, date_of_issue, date_of_expiry, success_level, raw_ocr_data, image_link).
- **Response:**
  - Success (200): 
    - `editdoc_data`: Updated document details.
  - Error (422): 
    - `editdoc_data`: Error details.

---

### Delete Document

- **URL:** `/deletedoc/:docid`
- **Method:** `DELETE`
- **Description:** Delete a document by its ID.
- **Authorization Header:**
  - `Authorization`: Bearer token obtained during login.
- **Response:**
  - Success (200): 
    - `deletedoc_data`: Deleted document details.
  - Error (404): 
    - `deletedoc_data`: "Document not found".

---
