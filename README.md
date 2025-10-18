# Course Selling App Backend

A simple Express + MongoDB backend for a course marketplace with JWT-based authentication for Admins and Users. It exposes endpoints to manage courses (admin) and purchase/list courses (user).

- Runtime: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT)
- Default port: 3000


## Project structure

```
Course Selling App Backend/
├─ index.js                # App entrypoint (express app and route mounting)
├─ config.js               # JWT secret
├─ db/
│  └─ index.js             # Mongoose models and DB connection
├─ middleware/
│  ├─ admin.js             # Admin auth middleware (JWT)
│  └─ user.js              # User auth middleware (JWT)
├─ routes/
│  ├─ admin.js             # Admin routes
│  └─ user.js              # User routes
├─ solution/               # Reference/solution variant of the app
└─ package.json
```


## Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string (Atlas or local). The repository currently has an example Atlas URI hardcoded in `db/index.js`. You should replace it with your own.


## Setup

```bash
# Install dependencies
npm install

# Start the server
node index.js
```

Server starts on http://localhost:3000.

Tip for WSL users: The above commands work directly in your WSL shell.

Note: If you see an error like "Cannot find module 'body-parser'", install it with:

```bash
npm i body-parser
```


## Configuration

- JWT secret: defined in `config.js` under `JWT_SECRET`.
- MongoDB URI: currently set directly in `db/index.js` via `mongoose.connect(...)`. Replace this with your own URI for local development/production. Avoid committing secrets.

Example (db/index.js):
```js
mongoose.connect('mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority');
```


## Data models

- Admin: { username: String, password: String }
- User: { username: String, password: String, purchasedCourses: [ObjectId Course] }
- Course: { title: String, description: String, imageLink: String, price: Number }


## API overview

Base URL: http://localhost:3000

Note: The code mounts routers at `/admin` and `/user` (singular). Some field names differ slightly from the README in this repo; the list below reflects the actual code.

### Auth header format

Authorization: `Bearer <token>`


### Admin routes (prefix: /admin)

1) POST /admin/signup
- Creates an admin account.
- Body: { "username": string, "password": string }
- Response: { msg: "Admin Created Successfully" }

2) POST /admin/signin
- Signs in an admin.
- Body: { "username": string, "password": string }
- Response: { token: string }

3) POST /admin/courses
- Creates a course. Requires admin JWT.
- Headers: Authorization: Bearer <token>
- Body (as implemented): { "title": string, "description": string, "images": string, "price": number }
  - Note: the field read by the server is `images` and is stored as `imageLink` internally.
- Response: { message: "Course created successfully", courseId: string }

4) GET /admin/courses
- Lists all courses. Requires admin JWT.
- Headers: Authorization: Bearer <token>
- Response: { courses: Course[] }


### User routes (prefix: /user)

1) POST /user/signup
- Creates a user account.
- Body: { "username": string, "password": string }
- Response: { msg: "User Created Successfully" }

2) POST /user/signin
- Signs in a user.
- Body: { "username": string, "password": string }
- Response: { jwtToken: string }

3) GET /user/courses
- Lists all courses. (No auth required in current implementation.)
- Response: { course: Course[] }

4) POST /user/courses/:courseId
- Purchases a course for the authenticated user.
- Headers: Authorization: Bearer <jwtToken>
- Params: courseId (string)
- Response: { msg: "Purchased Successfully" }

5) GET /user/purchasedCourses
- Lists courses purchased by the authenticated user.
- Headers: Authorization: Bearer <jwtToken>
- Response: { courses: Course[] }


## Quick start with curl

```bash
# 1) Admin signup
curl -s -X POST http://localhost:3000/admin/signup \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin1","password":"pass"}'

# 2) Admin signin (capture token)
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/admin/signin \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin1","password":"pass"}' | jq -r .token)

echo "ADMIN_TOKEN=$ADMIN_TOKEN"

# 3) Create a course as admin (note: body uses `images` field)
curl -s -X POST http://localhost:3000/admin/courses \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Node Basics","description":"Intro to Node","images":"https://picsum.photos/seed/1/300/200","price":99}'

# 4) User signup
curl -s -X POST http://localhost:3000/user/signup \
  -H 'Content-Type: application/json' \
  -d '{"username":"user1","password":"pass"}'

# 5) User signin (capture jwtToken)
USER_TOKEN=$(curl -s -X POST http://localhost:3000/user/signin \
  -H 'Content-Type: application/json' \
  -d '{"username":"user1","password":"pass"}' | jq -r .jwtToken)

echo "USER_TOKEN=$USER_TOKEN"

# 6) List courses (open endpoint)
curl -s http://localhost:3000/user/courses | jq .

# 7) Purchase a course (replace COURSE_ID)
COURSE_ID=<paste_course_id_here>
curl -s -X POST http://localhost:3000/user/courses/$COURSE_ID \
  -H "Authorization: Bearer $USER_TOKEN"

# 8) List purchased courses
curl -s http://localhost:3000/user/purchasedCourses \
  -H "Authorization: Bearer $USER_TOKEN" | jq .
```

Note: The curl examples use `jq` to parse JSON; install it with `sudo apt-get install -y jq` inside WSL if needed.


## Development notes

- Error handling and validation are minimal in this educational project. In a production system, use a validator like Zod/Joi and hash passwords (e.g., bcrypt).
- Token field names differ: admin returns `token`, user returns `jwtToken`.
- The user courses listing `/user/courses` does not require auth in the current code.
- Secrets (Mongo URI, JWT secret) should be moved to environment variables for safety.


## Troubleshooting

- Cannot connect to MongoDB: Update the URI in `db/index.js` to your Mongo instance and ensure network/IP access is allowed (for Atlas).
- 401/403 errors: Ensure you include `Authorization: Bearer <token>` and you’re using the right token (admin vs user).
- Server not starting: Ensure Node 18+, run `npm install`, then `node index.js`. Check for port conflicts on 3000.
- Missing dependency body-parser: Run `npm i body-parser`.


## License

ISC (as per package.json).