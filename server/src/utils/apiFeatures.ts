import { Query, Document, FilterQuery } from "mongoose";

type AnyObject = {
  [key: string]: any;
};

export default class ApiFeatures<T> {
  constructor(public query: any, public queryString: AnyObject) {}

  filter() {
    let queryStr = { ...this.queryString };

    const toRemoveFields: string[] = [
      "limit",
      "sort",
      "page",
      "search",
      "fields",
    ];

    toRemoveFields.map((el: string) => {
      delete queryStr[el];
    });

    if (queryStr) {
      const forMattedQueryStr = JSON.stringify(queryStr).replace(
        /\b(lte|gte|lt|gt)/,
        (matched) => `$` + matched
      );

      queryStr = JSON.parse(forMattedQueryStr);

      this.query.find(queryStr as FilterQuery<T>);
    }

    return this;
  }

  paginate() {
    let limit = +this.queryString?.limit || 100;
    let page = +this.queryString?.page || 1;

    this.query.skip(limit * (page - 1)).limit(limit);

    return this;
  }

  sort() {
    let sortStr = this.queryString.sort;

    if (sortStr) {
      this.query.sort(sortStr);
    } else {
      this.query.sort({ createdAt: -1 });
    }

    return this;
  }
}
