blog is on the internet here: http://daiyi.co/blog

## How to add comment on a post

- fill out this template:

  ```yaml
  comment_list:
    - name:
      url: (or email or other identifier)
      color: (hex, rgb, or color name)
      comment: |

  ```

- find the post under https://github.com/daiyitastic/blog/blob/master/source/_posts

- add the comment to the frontmatter section (the yaml-format metadata at the top of the markdown file)

- for example, here we are commenting on `blog-post.md`:
  ```yaml
  ---
  title: A list of my Feelings
  categories: other
  comment_list:
    - name: Potato Friend
      url: http://twitter.com/potato
      color: #27e10e
      comment: |
        I have many feelings
        Let me tell them to you
        newlines will be included
        this poem is over
  ---
  And here is the body of the blog post
  etc
  ```

- alternatively, email the comment to comments@daiyi.co

### notez

added theme:
```
git subtree add --prefix themes/maupassant git@github.com:tufu9441/maupassant-hexo.git master --squash

```
