class APIFeatures {
  //? will return a modified query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //? 1A) Filtering
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);
    // console.log('queryObject: ', queryObject);

    //? this querying method is too simple and limits our ability to put other items like Sort and Pagination in the parameters so... fixed this by excluding the fields

    //! Filter first then sort is faster
    //? 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; //? the entire object with updated context
  }

  sort() {
    //? 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //? default sort
      this.query = this.query.sort('-createdAt');
    }

    return this; //? the entire object with updated context
  }

  limitFields() {
    //? 3) Field Limiting (Projecting)
    // fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      //? default fields - we exclude
      this.query = this.query.select('-__v');
    }

    return this; //? the entire object with updated context
  }

  paginate() {
    //? 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // //? handle pagination error
    // if (this.queryString.page) {
    //   const numberOfTours = await Tour.countDocuments();
    //   if (skip >= numberOfTours) throw new Error('This page does not exist');
    // }

    return this; //? the entire object with updated context
  }
}

module.exports = APIFeatures;
