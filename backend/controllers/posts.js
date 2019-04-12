const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host")
  console.log(req)
  const post = new Post({
    title: req.body.title,
    content:req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.id
  });
  post.save().then(createdPost => {
    console.log(createdPost)
    res.status(201).json({
      message:'success added post',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath:createdPost.imagePath
      }
    });
  }).
  catch(err => {
    res.status(500).json({message: "Creating a post failed"})
  });

}
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + "://" + req.get("host")
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content:  req.body.content,
    imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({_id: req.params.id, creator: req.userData.id}, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({message:'Updated successfully'});
    } res.status(401).json({message:'Updated fail'});
  })
  .catch(err => {
    res.status(500).json({message: 'couldnt delete post'})
  })
}
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize&&currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Post fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(err => {
      res.status(500).json({message: 'fetching post failed'})
    });
}
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'fetching post failed'})
  });
}
exports.deletePost = (req, res, err) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.id}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message:'Deleted successfully'});
    } res.status(401).json({message:'Not authorized'});
  })
  .catch(err => {
    res.status(500).json({message: 'couldnt delete post'})
  })
}
