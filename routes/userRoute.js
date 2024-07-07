import express from "express";
import {
  userRegisterController,
  userLoginController,
  createBlogController,
  getAllBlog,
  getPhoto,
  getAllBlogCategory,
  getSingleBlog,
  updateBlog,
  saveComment,
  getComments,
  deleteBlog,
  deleteComment,
} from "../controllers/userController.js";
import formidable from "express-formidable";

const router = express.Router();

//register || post
router.post("/register", userRegisterController);

//login || post
router.post("/login", userLoginController);

//create blog || post
router.post("/create-blog", formidable(), createBlogController);

//get all blogs
router.get("/getblogs", getAllBlog);
//  get all blogs
router.get("/getblogs-category/:category", getAllBlogCategory);

//get photo
router.get("/getphoto/:pid", getPhoto);
//get single blog
router.get("/getblog/:id", getSingleBlog);
//update blog
router.put("/update-blog/:id", formidable(), updateBlog);
//delete blog
router.delete("/delete-blog/:id", deleteBlog);
//comment blog
router.post("/comment", saveComment);
//get comment
router.get("/get-comments/:id", getComments);
//delete comment
router.delete("/delete-comment/:id", deleteComment);

export default router;
