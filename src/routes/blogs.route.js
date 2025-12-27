import Router from 'express';
import { getAllBlogs , createBlog , getBlogById  , deleteBlog , updateBlog , createComment , getAllComments } from '../controllers/blogs.controllers.js';
import validateToken from '../middlewares/validateToken.middlerware.js';

const router = Router();

router.route('/blogs').get(getAllBlogs)
router.route('/blogs/:id').get(validateToken,getBlogById)
router.route('/blogs').post(validateToken,createBlog)
router.route('/blogs/:id').patch(validateToken,updateBlog)
router.route('/blogs/:id').delete(validateToken,deleteBlog)


router.route('/blogs/:id/comments').post(validateToken,createComment)
router.route('/blogs/:id/comments').get(validateToken,getAllComments)



export { router };
