/**
 *
 * @param {Object} [query={}]
 * @param {Object} [options={}]
 * @param {Object|String} [options.select]
 * @param {Object|String} [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean} [options.lean=true]
 * @param {Number} [options.page=0]
 * @param {Number} [options.limit=0]
 * ======  Use ======:
 let options = {
  select: 'name email role',
  sort: { date: -1 },
  populate: 'posts',
  lean: false,
  page: 1,
  limit: 9,
 };
 let query = {} // Query criteria. https://docs.mongodb.com/manual/tutorial/query-documents/
 
 * Default is get all.
 * @returns {Promise<{totalRecords, docs}>}
 */

//fixme: currentPage and totalPages is likely a mistake in some cases when URL don't have some query params (In the case have any empty ones) => calculate again
let paginate = async function (query = {}, options = {}) {
  let select = options.select;
  let sort = options.sort;
  let populate = options.populate;
  let lean = options.lean || true;
  let page = parseInt(options.page);
  let limit = parseInt(options.limit);
  limit = limit ? limit : 0;
  let skip = page ? ((page - 1) * limit) : 0;
  
  let docsQuery = this.find(query)
    .select(select)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(lean);
  
  if (populate) {
    [].concat(populate).forEach((item) => {
      docsQuery.populate(item);
    });
  }
  
  try {
    let docs = await docsQuery.exec();
    let totalRecords = await this.where(query).countDocuments();
    let currentPage = page || 1;
    let totalPages = limit ? Math.ceil(totalRecords / limit) : 1;
    return {
      docs,
      totalRecords,
      currentPage,
      totalPages
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * This function invoke immediately when "Mongoose Instance" register use plugin.
 * @param schema - This Schema refer to all Schema Instance.
 * Because "schema" object is refer to all Schema Instance, thus hook, statics or methods written in this function will
 * affect to all Schema Instance.
 * @param options
 */
module.exports = (schema, options) => {
  /**
   * Add static "class" method to Model itself. (Model maybe is Users, Posts, etc)
   * Refer: https://stackoverflow.com/questions/39708841/what-is-the-use-of-mongoose-methods-and-statics
   * and: https://mongoosejs.com/docs/guide.html#statics
   *
   * @type {paginate}
   */
  schema.statics.paginate = paginate;
};
