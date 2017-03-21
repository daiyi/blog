blog is on the internet here: http://daiyi.co/blog

## How to add comment on a post

- find the post under https://github.com/daiyitastic/blog/blob/master/source/_posts

- go to the `/{post-folder}/_comments.yaml` file

- add your comment to the list!

  ```yaml
  - name:
    date:
    url:
    color:
    comment: |
      words words words
  ```

- every field is optional. you can use [markdown](https://daringfireball.net/projects/markdown/syntax) in the comments field:

  ```yaml
  - name: tiny friend
    url: https://twitter.com/potato
    color: #27e10e
    comment: |
      I support your fundraiser for [whales](whales.com)!

      Whales are _great_.
  ```

- alternatively, email the comment to comments@daiyi.co

- If you want to edit your comment, make another PR or email me or whatever. it's all cool.
