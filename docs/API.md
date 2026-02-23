# Cruising Porto API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All authenticated endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "nickname": "username",
    "age": 25,
    "city": "Porto"
  }
  ```
- **Response**: `{ token, user }`

#### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ token, user }`

### Locations

#### Get All Locations
- **Endpoint**: `GET /locations`
- **Query Parameters**:
  - `lat` - latitude
  - `lng` - longitude
  - `radius` - distance in kilometers
  - `type` - location type (park, sauna, etc.)
- **Response**: `[ { id, name, type, lat, lng, checkins, rating } ]`

#### Get Nearby Locations
- **Endpoint**: `GET /locations/near/:lat/:lng`
- **Query Parameters**:
  - `radius` - distance in kilometers (default: 5)
- **Response**: `[ location ]`

#### Get Location Details
- **Endpoint**: `GET /locations/:id`
- **Response**: 
  ```json
  {
    "id": 1,
    "name": "Parque da Quinta da Conceição",
    "description": "...",
    "lat": 41.157,
    "lng": -8.629,
    "checkins": 15,
    "rating": 4.5,
    "comments": [...],
    "safe": true
  }
  ```

### Check-ins

#### Create Check-in
- **Endpoint**: `POST /checkins`
- **Auth**: Required
- **Body**:
  ```json
  {
    "location_id": 1,
    "anonymous": false
  }
  ```
- **Response**: `{ id, user_id, location_id, timestamp }`

#### Get Location Check-ins
- **Endpoint**: `GET /checkins/location/:id`
- **Query Parameters**:
  - `limit` - number of results (default: 20)
- **Response**: `[ { id, user, timestamp } ]`

#### Delete Check-in
- **Endpoint**: `DELETE /checkins/:id`
- **Auth**: Required
- **Response**: `{ success: true }`

### Comments

#### Add Comment
- **Endpoint**: `POST /comments`
- **Auth**: Required
- **Body**:
  ```json
  {
    "location_id": 1,
    "text": "Great place!",
    "rating": 5
  }
  ```
- **Response**: `{ id, user, text, rating, timestamp }`

#### Get Location Comments
- **Endpoint**: `GET /comments/location/:id`
- **Query Parameters**:
  - `limit` - number of results
- **Response**: `[ comment ]`

### Users

#### Get Current User
- **Endpoint**: `GET /users/me`
- **Auth**: Required
- **Response**: `{ user }`

#### Update Profile
- **Endpoint**: `PUT /users/me`
- **Auth**: Required
- **Body**: `{ nickname, age, description, preferences }`
- **Response**: `{ user }`

#### Get Nearby Users
- **Endpoint**: `GET /users/nearby`
- **Auth**: Required
- **Query Parameters**:
  - `lat`, `lng`, `radius`
- **Response**: `[ { id, nickname, age, distance } ]`

### Messages

#### Send Message
- **Endpoint**: `POST /messages`
- **Auth**: Required
- **Body**:
  ```json
  {
    "to_user_id": 5,
    "text": "Hello!"
  }
  ```
- **Response**: `{ id, from, to, text, timestamp }`

#### Get Conversation
- **Endpoint**: `GET /messages/:userId`
- **Auth**: Required
- **Response**: `[ message ]`

## Error Responses

### 400 Bad Request
```json
{ "error": "Missing required fields" }
```

### 401 Unauthorized
```json
{ "error": "Invalid or missing token" }
```

### 404 Not Found
```json
{ "error": "Resource not found" }
```

### 500 Internal Server Error
```json
{ "error": "An unexpected error occurred" }
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
