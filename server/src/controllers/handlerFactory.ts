import { Model, PopulateOption } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import ApiFeatures from "../utils/apiFeatures";

export const getOne = <T>(UModel: Model<T>, popuOpt?: string | string[]) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let data = await UModel.findById(id).populate(popuOpt ? popuOpt : []);

    if (!data) {
      return next(new AppError("No data is found with this id!", 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const getAll = <T>(
  UModel: Model<T>,
  popuOpt?: string | string[],
  isForMessages?: boolean
) =>
  catchAsync(async (req, res, next) => {
    let query = new ApiFeatures<T>(
      UModel.find().populate(popuOpt || []),
      req.query
    )
      .sort()
      .paginate()
      .filter();
    let data = await query.query;

    res.status(200).json({
      status: "success",
      results: data.length,
      data: isForMessages ? [...data].reverse() : data,
    });
  });
