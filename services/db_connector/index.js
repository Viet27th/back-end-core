/**
 * Connect database.
 * https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57
 * Terminologies
 *
 * Collections
 ‘Collections’ in Mongo are equivalent to tables in relational databases. They can hold multiple JSON documents.
 
 * Documents
 ‘Documents’ are equivalent to records or rows of data in SQL. While a SQL row can reference data in other tables, Mongo documents usually combine that in a document.
 
 * Fields
 ‘Fields’ or attributes are similar to columns in a SQL table.
 
 * Schema
 While Mongo is schema-less, SQL defines a schema via the table definition. A Mongoose ‘schema’ is a document data structure (or shape of the document) that is enforced via the application layer.
 
 * Models
 ‘Models’ are higher-order constructors that take a schema and create an instance of a document equivalent to records in a relational database.
 
 * @type {*|Mongoose}
 */
const mongoose = require('mongoose');
const paginatePlugin = require('./plugins/paginate');
const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const options = {
  useNewUrlParser: true,
  bufferMaxEntries: 0,      // If not connected, return errors immediately rather than waiting for reconnect
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
};
mongoose.connect(uri, options).then(
  () => {
    console.log('Database connected success!');
  },
  (err) => {
    /** handle initial connection error */
    throw err;
  }
).catch(error => {
  console.log(error);
});

/**
 * Refer: https://mongoosejs.com/docs/api.html#connection_Connection-plugin
 * Declares a plugin executed on all schemas you pass to conn.model()
 * Nếu viết hook, .method, .static vào đây, nó sẽ có thể áp dụng có tất cả các Schema thay cho việc hook, .method, .static cho từng Schema
 */
mongoose.plugin(paginatePlugin);

module.exports = mongoose;
