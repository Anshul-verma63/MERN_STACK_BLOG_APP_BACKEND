import userModal from "../models/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tkenModal from "../models/tkenModal.js";
import blogModel from "../models/blogModel.js";
import fs from "fs";
import commentModel from "../models/commentModel.js";
export const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(501).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(501).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(501).send({
        success: false,
        message: "Password is required",
      });
    }

    //find user
    const user = await userModal.findOne({ email: email });
    if (user) {
      return res.status(200).send({
        success: true,
        message: "user already exist please login",
      });
    }

    //hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new userModal({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(200).send({
      success: true,
      message: "user regiter",
      newUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while register user",
      error,
    });
  }
};

//login user
export const userLoginController = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) {
      return res.status(501).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!password) {
      return res.status(501).send({
        success: false,
        message: "Password is required",
      });
    }

    //find user in databse
    const user = await userModal.findOne({ name: name });
    if (!user) {
      return res.status(501).send({
        success: false,
        message: "User not resistered please register first",
      });
    }

    //password match
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(501).send({
        success: false,
        message: "Incorrect email or password",
      });
    }

    //generate tokens
    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN);

    //save token
    const token = new tkenModal({ token: refreshToken });
    await token.save();

    return res.status(200).send({
      success: true,
      message: "user login",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while login user",
      error,
    });
  }
};

//create blog
export const createBlogController = async (req, res) => {
  try {
    const { username, title, description, category, createDate } = req.fields;
    const { photo } = req.files;

    if (!username) {
      return res.send({ message: "username is required" });
    }
    if (!title) {
      return res.send({ message: "title is required" });
    }
    if (!description) {
      return res.send({ message: "description is required" });
    }
    if (!category) {
      return res.send({ message: "category is required" });
    }

    const newBlog = new blogModel({ ...req.fields, category: category });
    if (photo) {
      newBlog.photo.data = fs.readFileSync(photo.path);
      newBlog.photo.contentType = photo.type;
    }
    await newBlog.save();
    return res.status(200).send({
      success: "true",
      message: "Blog created successfully",
      newBlog,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Error while creating blog",
      error,
    });
  }
};

//get all blog
export const getAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).select("-photo");

    res.status(200).send({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Error while get blogs",
      error,
    });
  }
};

//get photo
export const getPhoto = async (req, res) => {
  try {
    const product = await blogModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Error while get blogs",
      error,
    });
  }
};

export const getAllBlogCategory = async (req, res) => {
  try {
    let blogs;
    if (req.params.category === "All-blogs") {
      blogs = await blogModel.find({}).select("-photo");
    } else {
      blogs = await blogModel
        .find({ category: req.params.category })
        .select("-photo");
    }
    res.status(200).send({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while get blogs category",
      error,
    });
  }
};

//get single blog
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await blogModel
      .findById({ _id: req.params.id })
      .select("-photo");
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while get blog data",
      error,
    });
  }
};

//update blog
export const updateBlog = async (req, res) => {
  try {
    const { photo } = req.files;

    const UpdateBlog = await blogModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    if (photo) {
      UpdateBlog.photo.data = fs.readFileSync(photo.path);
      UpdateBlog.photo.contentType = photo.type;
    }
    await UpdateBlog.save();
    return res.status(200).send({
      message: "Blog updated successfully",
      updateBlog,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while Update blog",
      error,
    });
  }
};

//delete blog
export const deleteBlog = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while delete blog",
      error,
    });
  }
};

//save cooment
export const saveComment = async (req, res) => {
  try {
    const newComment = new commentModel(req.body);
    await newComment.save();

    return res.status(200).send({
      message: "Comment saved sucess",
      newComment,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while save comment",
      error,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await commentModel.find({ id: req.params.id });
    res.status(200).send({
      comments,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while get comment",
      error,
    });
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    await commentModel.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).send({
      message: "Comment deleted success",
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "Errror while delete comment",
      error,
    });
  }
};
