# 🏫 Preschool Registration System

## Project Title
**Preschool Registration System** — ICA 03 | Web Services and Technology (IT2234)

---

## Problem Description
Many preschools in Sri Lanka still rely on manual, paper-based registration processes. Parents must visit in person, fill out forms by hand, and wait for staff to process enrollments manually. This leads to:
- Data loss and errors in records
- Difficulty tracking class capacities
- No easy way to update or retrieve child/parent information

---

## Proposed Solution
A RESTful backend system that allows preschool administrators to digitally manage:
- **Child registrations** (enroll, update status, delete)
- **Parent/guardian records** (add, view, update, remove)
- **Class management** (create classes, assign children, track capacity)

---

## Features
- Register a new child with parent and class linkage
- Add and manage parent/guardian profiles
- Create and manage preschool classes with age groups and capacity
- Full CRUD operations across all three collections
- Duplicate entry prevention
- Proper error handling and HTTP status codes
- Populated responses (child record includes parent & class details)

---

## Technologies Used
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Environment Variables:** dotenv
- **Body Parsing:** body-parser
- **API Testing:** Postman
- **Version Control:** GitHub

---

## Project Structure
```
preschool-registration/
├── index.js               # Entry point
├── .env                   # Environment variables
├── package.json
├── Model/
│   ├── childModel.js      # Child schema
│   ├── parentModel.js     # Parent schema
│   └── classModel.js      # Class schema
├── controller/
│   ├── childController.js
│   ├── parentController.js
│   └── classController.js
└── routes/
    ├── childRoute.js
    ├── parentRoute.js
    └── classRoute.js
```

---

## API Endpoints

### 👶 Children — `/api/children`
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/create`                     | Register a new child     |
| GET    | `/getallchildren`             | Get all registered children |
| GET    | `/getchildren/:id`            | Get a child by ID        |
| PUT    | `/update/:id`                 | Update child details     |
| DELETE | `/delete/:id`                 | Remove child registration |

**POST /api/children/create — Example Body:**
```json
{
  "firstName": "Amal",
  "lastName": "Perera",
  "dateOfBirth": "2021-03-15",
  "gender": "Male",
  "medicalNotes": "No known allergies",
  "enrollmentDate": "2025-01-10",
  "status": "Active",
  "parentId": "<parent_object_id>",
  "classId": "<class_object_id>"
}
```

---

### 👨‍👩‍👧 Parents — `/api/parents`
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/create`                     | Add a new parent/guardian |
| GET    | `/getallparents`              | Get all parents          |
| GET    | `/getparent/:id`              | Get a parent by ID       |
| PUT    | `/update/:id`                 | Update parent details    |
| DELETE | `/delete/:id`                 | Remove a parent          |

**POST /api/parents/create — Example Body:**
```json
{
  "name": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Galle Road, Colombo",
  "relationship": "Mother"
}
```

---

### 🏫 Classes — `/api/classes`
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/create`                     | Create a new class       |
| GET    | `/getallclasses`              | Get all classes          |
| GET    | `/getclass/:id`               | Get a class by ID        |
| PUT    | `/update/:id`                 | Update class details     |
| DELETE | `/delete/:id`                 | Delete a class           |

**POST /api/classes/create — Example Body:**
```json
{
  "className": "Sunflower Class",
  "ageGroup": "3-4 years",
  "capacity": 20,
  "teacher": "Mrs. Silva",
  "schedule": "Monday to Friday, 8AM - 12PM"
}
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)
- Postman (for testing)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/preschool-registration.git
cd preschool-registration
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root:
```
PORT=8000
MONGO_URL="mongodb://localhost:27017/preschoolDB"
```

4. **Run the project**
```bash
npm start
```

The server will start at: `http://localhost:3000`

---

## How to Run the Project

1. Make sure MongoDB is running locally (`mongod`)
2. Run `npm start` in the project root
3. Open Postman and import the collection (optional)
4. Test endpoints using the base URL: `http://localhost:3000`

## Web UI
After starting the server, open `http://localhost:3000/` to use the modern CRUD UI
for Parents, Classes, and Child Enrollments (it syncs via the same `/api/*` endpoints).

---

## Workflow Example

1. **Create a Parent** → `POST /api/parents/create` → copy the returned `_id`
2. **Create a Class** → `POST /api/classes/create` → copy the returned `_id`
3. **Register a Child** → `POST /api/children/create` with `parentId` and `classId`
4. **View all Children** → `GET /api/children/getallchildren` (shows populated parent & class info)
