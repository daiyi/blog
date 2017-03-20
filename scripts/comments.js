var fs = require('fs');
var path = require('path');
var marked = require('marked');

hexo.extend.filter.register('before_post_render', data => {
  if (data.layout !== 'post' || !data.title) {
    return data;
  }
  else {
    console.log(data.layout, data.title);
  }

  var file = null;

  fs.stat(data.asset_dir, (err, stats) => {
    // make asset directory if it doesn't exist
    if (err) {
      fs.mkdir(data.asset_dir)
    }

    var filepath = path.join(data.asset_dir, 'comments.md');

    if (fs.existsSync(filepath)) {
      file = fs.readFileSync(filepath, 'utf8');
      file = marked(file);
    }
    else {
      var comment_file_default = `<!-- how to leave a comment: https://github.com/daiyi/blog/#how-to-add-comment-on-a-post -->
<!-- template:

* [name](url)

I am a comment! _yay markdown_

You can make paragraphs, too.

-->`
      fs.writeFile(filepath, comment_file_default, function (err) {
        if (err) {
          return console.log(err);
        }

        // console.log("created:", filepath);
      });
    }
  });

  return data.markdown_comments = file
});
