# Simple Restful CRUD API with Node.js, Express, and MySQL

### Create Node.js application

First open terminal/console, then create a folder for our application:

```
$ mkdir Node-Express-MySQL
$ cd Node-Express-MySQL
```

Initialize the Node.js application:

```
npm init --y
```

Next, we need to install necessary modules: express, mysql2, sequelize and cors.
Run the command:

```
npm install express mysql2 sequelize cors --save
```

Open the package.json file and add "type": "modules", the package.json file should look like this:

```json
{
  "name": "node-express-mysql",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mysql2": "^3.2.0",
    "sequelize": "^6.29.3"
  }
}
```

### Setup Express web server

Now, in the root folder, we create a new file named index.js:

```Javascript
import express from "express";
import cors from "cors";
import user from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(user);

app.listen(5000, () => console.log("Server Running at http://localhost:5000"));
```

### Create MySQL database

Before connecting Node.js Application with MySQL, we need create a database named testdb.

### Configure MySQL database

We’re gonna have a separate folder for configuration. Let’s create config folder in the root folder, then create db.config.js file inside that config folder with content like this:

```Javascript
import { Sequelize } from "sequelize";

const db = new Sequelize("testdb", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
```

### Define the Model

In models folder, create a file called user.model.js. We’re gonna define the user table here
This is the content inside user.model.js:

```Javascript
import { Sequelize } from "sequelize";
import db from "../config/db.config.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default User;

(async () => {
  await db.sync();
})();
```

### Define Routes

When a client sends request for an endpoint using HTTP request (GET, POST, PATCH, DELETE), we need to determine how the server will response. It’s why we’re gonna setup the routes.

These are routes we define:

`/users`: GET, POST, DELETE <br />
`/users/:id`: GET, PATCH, DELETE

Create a routes folder, then create user.routes.js file with content like this:

```Javascript
import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
```

You can see that we use a controller from /controllers/user.controller.js. It contains methods for handling CRUD operations and will be created in the next step.

We also need to include routes in index.js (right before `app.listen()`):

```Javascript
import user from "./routes/user.route.js";

app.use(user);

app.listen(...);
```

The index.js file should look like this:

```Javascript
import express from "express";
import cors from "cors";
import user from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(user);

app.listen(5000, () => console.log("Server Running at http://localhost:5000"));
```

### Create the Controller

Now we create a controllers folder, then we have a file named user.controller.js. Our controller will be written inside this with CRUD functions:

- getUsers
- getUserById
- createUser
- updateUser
- deleteUser

```Javascript
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
```

### Test the APIs

Run our Node.js application with command: node index.js.
The console shows:

```
Server Running at http://localhost:5000
```

Using Postman, we’re gonna test all the Apis above.
