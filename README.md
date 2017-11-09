Instructions

1. Clone the project:
```
$> git clone https://github.com/TimFLaherty/node-mysql-starter
```

2. cd in to the 'node-mysql-starter' directory and install modules:
```
$>npm install
```

3. Create and populate the MySQL 'testdb' database using the files in the 'dbsetup' folder:

```
mysql> source db_create.sql
mysql> source db_insert.sql
```

4. Enter your database credentials where indicated in to the 'app.js' file.

5. cd in to the 'app' directory and type:

```
$>node app.js
```

6. Navigate to localhost:3000 and get started!
