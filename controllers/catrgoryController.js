import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const newCategory = new categoryModel({ name: req.body.name });
    await newCategory.save();
    return res.status(200).send({
      message: "Category created success",
      newCategory,
    });
  } catch (error) {
    res.status(501).send({
      message: "error while creating category",
      error,
    });
  }
};

//get all categories
export const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    return res.status(200).send({
      message: "Get category successfully",
      categories,
    });
  } catch (error) {
    res.status(501).send({
      message: "Error while get category",
      error,
    });
  }
};
