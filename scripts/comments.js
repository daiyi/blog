var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var marked = require('marked');

hexo.extend.filter.register('before_post_render', data => {
  if (data.layout !== 'post' || !data.title) {
    return data;
  }

  fs.stat(data.asset_dir, (err, stats) => {
    // make asset directory if it doesn't exist
    if (err) {
      fs.mkdir(data.asset_dir)
    }

    var filepath = path.join(data.asset_dir, '_comments.yaml');

    if (fs.existsSync(filepath)) {

      var comments = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));

      if (comments) {
        comments.forEach(comment => {
          comment.comment = marked(comment.comment);
        })

        return data.markdown_comments = comments;
      }

    }
    else {
      var comment_file_default = `# how to leave comments: https://github.com/daiyi/blog/#how-to-add-comment-on-a-post
# template (whitespace sensitive!):
# - name:
#   date:
#   url:
#   color:
#   comment: |
#     words words words
`
      fs.writeFile(filepath, comment_file_default, function (err) {
        if (err) {
          return console.log(err);
        }

        // console.log("created:", filepath);
      });
    }
  });
});
