# Book Store

This is a simple book store web application built with Node.js, Express.js, and MongoDB.


## Deployed Website

You can access the deployed website at the following link:

https://book-store-rjze.onrender.com


You can access the admin functions at the following link:

https://book-store-rjze.onrender.com/admin

**Admin Account** cannot be created automatically. Use the below account to access admin functions.
```
    email: lam@gmail.com
    password: lam123456
```
## Features

### For Users

- **Sign Up, Log In, Log Out**: Users can create an account, log in to their account, and log out when they're done.
- **Search for Books**: Users can search for books by title, author, or genre.
- **Purchase Books**: Users can browse through the available books and purchase them.
- **Check Orders**: Users can check their order history and view details of their past orders.

### For Admins


- **Manage Products**: Admins can add, edit, and delete products (books) from the store.
- **Manage Orders**: Admins can view and manage orders placed by users.
- **Manage Users**: Admins can view and manage user accounts, including blocking or deleting accounts if necessary.


## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web application framework for Node.js.
- **EJS (Embedded JavaScript)**: Template engine for generating HTML markup with JavaScript.
- **MongoDB**: NoSQL database for storing book data.


## Prerequisites

Before running this application locally, make sure you have the following installed:

- Node.js (if running without Docker)
- Docker
- Docker Compose

## Getting Started

### Running with Node.js

1. Clone the repository:

    ```
    git clone https://github.com/lam20042001/book-store.git
    ```

2. Navigate to the project directory:

    ```
    cd book-store
    ```

3. Install dependencies:

    ```
    npm install
    ```

4. Run the application:

    ```
    npm start
    ```

5. Open a web browser and go to http://localhost:4000 to view the application.

### Running with Docker

1. Clone the repository:

    ```
    git clone https://github.com/lam20042001/book-store.git
    ```

2. Navigate to the project directory:

    ```
    cd book-store
    ```

3. Run the application with Docker Compose:

    ```
    docker-compose up --build
    ```

    If you want to run it in detached mode, you can add the `-d` flag:

    ```
    docker-compose up --build -d
    ```

4. Open a web browser and go to http://localhost:4000 to view the application.

