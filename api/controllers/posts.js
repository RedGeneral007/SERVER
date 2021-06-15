const {
  Post,
  validate_post,
  generate_str,
  validate_featured_str
} = require('../models/post');

module.exports = {

    create_post: async (req, res) => {

      const { error } = validate_post(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      //If we dont have a file in our request - constant becomes empty
      const { path: image } = req.file ? req.file : "";
      
        let post = new Post(
          {
            title: req.body.title,
            content: req.body.content,
            image: image ? image.replace('\\', '/') : '',
            unique_str: await generate_str(Post),
            featured_by: [],
            user_id: req.user._id
          }
        );
      
        posted = await post.save();
        res.send(posted);
    },
    get_all_posts: async (req, res) => {

      let posts = await Post.find({});
      if (!posts) return res.status(404).send("No posts found");

      res.send(posts);
    },
    delete_post: async (req, res) => {
      
      const { error } = validate_featured_str(req.params.id);
      if (error) return res.status(400).send(error.details[0].message);

      const post = await Post.findOneAndRemove({unique_str: req.params.id, user_id: req.user._id});
      if (!post) return res.status(404).send('The post with the given ID was not found.');
      
      res.send(post);
    },
    add_featured: async (req,res) => {
        const { error } = validate_featured_str(req.params.id);
        if (error) return res.status(400).send(error.details[0].message);

        //Adds user id into post array which contain all IDs of users that "liked" it
        let post = await Post.findOneAndUpdate({unique_str: req.params.id}, {$addToSet: {featured_by: [req.user._id]} });
        
        if (!post) return res.status(404).send("Post not found");

        res.send(post);

    },
    get_all_my_featured: async (req,res) => {

        let posts = await Post.find({featured_by: req.user._id});
        if (!posts) return res.send("No featured posts");

        res.send(posts);
    },
    delete_from_featured: async (req, res) => {
      const { error } = validate_featured_str(req.params.id);
      if (error) return res.status(400).send(error.details[0].message);

      //Removes user id from post array which contain all IDs of users that "liked" it
      let post = await Post.findOneAndUpdate({unique_str: req.params.id}, {$pull: {featured_by: req.user._id}});

      if (!post) return res.status(404).send("Post not found");

      res.send(post);
    },
    get_my_posts: async (req, res) => {

      let posts = await Post.find({user_id: req.user._id});
      res.send(posts);
    },
    update_post: async (req, res) => {
      const { error } = validate_post(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      //If we dont have a file in our request - constant becomes empty
      const { path: image } = req.file ? req.file : "";

      //Recieveing the post which we want to update in image uploading purposes
      let post = await Post.findOne({ unique_str: req.params.id, user_id: req.user._id });
      if (!post) return res.status(404).send('Post not found.');

      //If we have a file image - saves it almost as it is
      //If we have a string instead of file and that string is equal to what we have in post (means image did not updated and NOT DELETED) - just ignore it
      //If that string is NOT equal to the post string - deletes and image from that post
      if (image) {
        post.image = image.replace('\\', '/');
        await post.save();
      }
      else if (req.body.image !== post.image) {
        post.image = "";
        await post.save();
      }

      updated_post = await Post.findOneAndUpdate({ unique_str: req.params.id, user_id: req.user._id }, req.body);
      res.send(updated_post);

    },
    get_post: async (req, res) => {

      const post = await Post.findOne({ unique_str: req.params.id, user_id: req.user._id });
      if (!post) return res.status(404).send('Post not found.');
      res.send(post);

    }
};