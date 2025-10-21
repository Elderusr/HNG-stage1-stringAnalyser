# **Text Insight API**

## Overview
This Node.js Express API provides robust text analysis capabilities, allowing users to store, retrieve, analyze, and filter strings with features like SHA256 hashing, palindrome detection, character frequency mapping, and natural language query parsing. It leverages `express` for routing, `compromise` for NLP, and `crypto` for hashing.

## Features
- **SHA256 Hashing**: Automatically computes and stores a SHA256 hash for each string.
- **Palindrome Detection**: Identifies whether a string is a palindrome.
- **Character Frequency Analysis**: Generates a frequency map for characters within a string.
- **Natural Language Query (NLQ) Parsing**: Allows filtering strings using descriptive, human-like language queries.
- **Dynamic String Filtering**: Supports filtering strings based on properties like length, word count, palindrome status, and character presence.
- **CRUD Operations**: Provides endpoints to create, retrieve, and delete strings.
- **CORS Enabled**: Configured to handle cross-origin requests.

## Getting Started
To get this project up and running locally, follow these steps.

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Elderusr/HNG-stage1-stringAnalyser.git
    cd HNG-stage1-stringAnalyser 
    ```
2.  **Install Dependencies**:
    Navigate into the project directory and install the necessary Node.js packages.
    ```bash
    npm install
    ```
3.  **Start the Server**:
    Launch the API server.
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:3000`.

## API Documentation
### Base URL
`http://localhost:3000` 

### Endpoints

#### POST /strings
Creates a new string entry, analyzes its properties, and stores it in the system.

**Request**:
```json
{
  "value": "string"
}
```
**Response**:
```json
{
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "value": "hello",
  "properties": {
    "length": 5,
    "is_palindrome": false,
    "unique_characters": 4,
    "word_count": 1,
    "sha254_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 2,
      "o": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```
**Errors**:
- `400 Bad Request`: Missing "value" field in request body.
- `422 Unprocessable Entity`: "value" must be a string.
- `409 Conflict`: String already exists in the system.

#### GET /strings/:stringValue
Retrieves the analysis data for a specific string using its raw value. The string value is hashed internally to find the entry.

**Request**:
Path parameter: `stringValue` (e.g., `/strings/hello`)

**Response**:
```json
{
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "value": "hello",
  "properties": {
    "length": 5,
    "is_palindrome": false,
    "unique_characters": 4,
    "word_count": 1,
    "sha254_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 2,
      "o": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```
**Errors**:
- `422 Unprocessable Entity`: Invalid string value.
- `404 Not Found`: String not found in the system.

#### GET /strings
Retrieves a list of stored strings, filtered by specified criteria.

**Request**:
Query parameters:
- `is_palindrome`: `true` or `false` (boolean string)
- `min_length`: Minimum length (integer)
- `max_length`: Maximum length (integer)
- `word_count`: Exact word count (integer)
- `contains_character`: A single character to check for inclusion (string)

**Example**: `GET /strings?is_palindrome=true&min_length=3`

**Response**:
```json
{
  "data": [
    {
      "id": "753900d720b080512f45c26b21699f7d0257367c336b9c9c381c8b746869403a",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha254_hash": "753900d720b080512f45c26b21699f7d0257367c336b9c9c381c8b746869403a",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 3
  }
}
```
**Errors**:
- `400 Bad Request`: Invalid value for `is_palindrome`, `min_length`, `max_length`, `word_count`, or `contains_character`.

#### GET /strings/nlp
Retrieves a list of stored strings by parsing a natural language query into filters.

**Request**:
Query parameter:
- `query`: A natural language string describing the desired filters.

**Example**: `GET /strings/nlp?query=show me palindromic strings longer than 4 characters`

**Response**:
```json
{
  "data": [
    {
      "id": "753900d720b080512f45c26b21699f7d0257367c336b9c9c381c8b746869403a",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha254_hash": "753900d720b080512f45c26b21699f7d0257367c336b9c9c381c8b746869403a",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```
**Errors**:
- `400 Bad Request`: Query must be provided and must be a string.
- `422 Unprocessable Entity`: Could not process the natural language query.

#### DELETE /strings/:stringValue
Deletes a string entry from the system based on its raw value.

**Request**:
Path parameter: `stringValue` (e.g., `/strings/hello`)

**Response**:
```json
{
  "message": "String deleted",
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
**Errors**:
- `422 Unprocessable Entity`: Invalid string value.
- `404 Not Found`: String not found in the system.

## Usage
Once the server is running, you can interact with the API using tools like cURL, Postman, or any HTTP client.

### Example: Creating a String
To create a new string entry, send a `POST` request to `/strings` with a JSON body containing the `value`.

```bash
curl -X POST \
  http://localhost:3000/strings \
  -H 'Content-Type: application/json' \
  -d '{
    "value": "racecar"
  }'
```

### Example: Retrieving a String by Value
To fetch the analysis for a string, make a `GET` request to `/strings/:stringValue`.

```bash
curl -X GET http://localhost:3000/strings/racecar
```

### Example: Filtering Strings
To retrieve strings based on specific criteria, use `GET /strings` with query parameters.

```bash
curl -X GET "http://localhost:3000/strings?is_palindrome=true&min_length=5&contains_character=c"
```

### Example: Natural Language Query
To filter strings using natural language, send a `GET` request to `/strings/nlp` with a `query` parameter.

```bash
curl -X GET "http://localhost:3000/strings/nlp?query=show me all single word palindromic strings"
```

### Example: Deleting a String
To remove a string from the system, send a `DELETE` request to `/strings/:stringValue`.

```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

## Technologies Used

| Technology         | Description                                    | Link                                           |
| :----------------- | :--------------------------------------------- | :--------------------------------------------- |
| **Node.js**        | JavaScript runtime environment                 | [nodejs.org](https://nodejs.org/en/)           |
| **Express.js**     | Fast, unopinionated, minimalist web framework  | [expressjs.com](https://expressjs.com/)        |
| **Compromise.js**  | Natural Language Processing library            | [compromise.cool](https://compromise.cool/)    |
| **CORS**           | Middleware for enabling Cross-Origin Resource Sharing | [www.npmjs.com/package/cors](https://www.npmjs.com/package/cors) |
| **Crypto**         | Node.js built-in module for cryptography       | [nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) |

## License
This project is licensed under the ISC License.

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue?style=flat&logo=express)](https://expressjs.com/)
[![Compromise.js](https://img.shields.io/badge/Compromise.js-14.x-purple?style=flat&logo=natural-language-processing)](https://compromise.cool/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
