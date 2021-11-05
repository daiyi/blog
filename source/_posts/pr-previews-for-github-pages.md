---
title: How to automate previews for Github Pages
date: 2021-11-05
categories:
  - software shit
tags:
  - tutorials
summary: Use Github Actions to create previews on pull requests to your gh-pages-hosted static site, by pushing to a secret subdirectory. What could go wrong??
image: comment-ready-preview.jpg
location: Mammoth Lakes
---

{% figureMD src="comment-ready-preview.jpg" %}
[Source here](https://github.com/daiyi/gh-pages-pr-previews). Live demo of [an open PR](https://github.com/daiyi/gh-pages-pr-previews/pull/2) with a site preview, and [a closed PR](https://github.com/daiyi/gh-pages-pr-previews/pull/1) with preview cleaned up.
{% endfigureMD %}

I host my website on Github Pages because it's simple, I don't need serverside stuff for a humble static website, I'm already in Github all day errday, and it was a top quality option when I set it up a billion technological years ago.

A feature of modern hosting platforms (e.g. Vercel) that I miss with GH Pages is getting automatic site previews on each PR, which is nice for showing other people your WIPs, or (if you're lone-wolfing it) quickly checking if things are broken without bothering with your local dev server.

So I thought I'd clobber something together using Github Actions and taking advantage of the directory structure of static sites :D

## How it works

To publish my website, I use a github action to compile each commit to the `main` branch, then push that output to the `gh-pages` branch.

Adding a PR preview is similar: build the site on each commit to a pull request, and push the result to the `/pull/{pr-number}` folder on the `gh-pages` branch. This means the preview can be accessed at `https://github.io/username/project/pull/{pr-number}`. Seems simple enough, right?

## Walkthrough

The end result is found here (spoiler alert): https://github.com/daiyi/gh-pages-pr-previews.

### Create a new static site

For this tutorial I'm starting with a fresh [Hugo](https://gohugo.io/) site, but you can use whatever static site generator you fancy.

```bash
# create new site
hugo new site gh-pages-pr-previews

# add theme
cd gh-pages-pr-previews
git init
git submodule add https://github.com/LukasJoswiak/etch.git themes/etch
echo theme = \"etch\" >> config.toml

# create a blog post
hugo new posts/pr-previews-for-gh-pages.md
echo 'I am making my website' >> content/posts/pr-previews-for-gh-pages.md

# check that it works at http://localhost:1313/
hugo server -D
```

### Host your site on github pages and automate deploy with github actions

Now it's time to tell Github about it. Create a repo at https://github.com/new (I initialised it as blank). Then,

```bash
# create first commit
git add .
git commit -m "create website"

# push to github
git remote add origin https://github.com/YOUR-USERNAME/gh-pages-pr-previews.git
git branch -M main
git push -u origin main

# create a github actions workflow
mkdir -p .github/workflows
touch .github/workflows/gh-pages.yml
```

To automate publishing your site to gh pages on every commit to `main`, add the following to the `.github/workflows/gh-pages.yml` file then push the change to github ([source here](https://github.com/daiyi/gh-pages-pr-previews/blob/76af83267a3ed4ff8b53d7b1b16dfce5e1131d7e/.github/workflows/gh-pages.yml)):

```yml
# .github/workflows/gh-pages.yml
name: github pages

on:
  push:
    branches:
      - main # deploy main. If your branch is `master`, you'll have to replace that throughout this file.

jobs:
  deploy:
    runs-on: ubuntu-20.04
    steps:
      - name: Set domain
        run: echo "DOMAIN=www.daiyi.co" >> $GITHUB_ENV # TODO set your custom domain
        # If you're using the default github pages url, use this instead:
        # run: echo "DOMAIN=${{ github.actor }}.github.io" >> $GITHUB_ENV

      - name: Checkout website repo
        uses: actions/checkout@v2
        with:
          submodules: true # fetch the theme
          # you need to set this as an environment env if your repo or any submodules (e.g the theme) is private:
          # token: ${{ secrets.PRIVATE_REPO_TOKEN }}

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: "0.88.1" # TODO set this to your hugo version

      - name: Set production base URL
        run: echo "BASE_URL=https://${{ env.DOMAIN }}/${{ github.event.repository.name }}/" >> $GITHUB_ENV

      - name: Build website
        run: hugo --baseURL "${{ env.BASE_URL }}"
        env:
          HUGO_ENV: production

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: ${{ env.DOMAIN }} # TODO you need to set this if you're using a custom domain. Otherwise you can remove it.
```

Once the file is in `main`, you should see the workflow running in the Actions tab: https://github.com/daiyi/gh-pages-pr-previews/actions.

When that's done, activate github pages by going to `Settings -> Pages` and picking the `gh-pages` branch under "Source". Click "Save". Checking "Enforce HTTPS" is recommended.

The github pages site should be live! I am using a custom domain so mine is at https://daiyi.co/gh-pages-pr-previews/. The default should look like: https://daiyi.github.io/gh-pages-pr-previews/.

If you look at your new site, you'll see that there's no posts, because your post was a draft :'D You can make it live by removing `draft: true` in `/content/posts/pr-previews-for-gh-pages.md`:

```diff
 ---
 title: "Pr Previews for Gh Pages"
 date: 2021-11-03T12:45:17-07:00
-draft: true
 ---

 I am making my website
```

If you commit and push this change, you'll see another github action kick off. It will take a minute for your site to reflect the new content, but if you keep refreshing the post will appear :D

### Automate static site previews on pull requests

Now we get to the finale. Modify the `gh-pages.yml` workflow to also compile the site on every commit to a pull request ([file source here](https://github.com/daiyi/gh-pages-pr-previews/blob/03d7b5f656d4c5d6ed40dcf4307a1ffa6bae30a7/.github/workflows/gh-pages.yml)):

```diff
diff --git a/.github/workflows/gh-pages.yml b/.github/workflows/gh-pages.yml

on:
   push:
     branches:
       - main # deploy main. If your branch is `master`, you'll have to replace that throughout this file.
+  pull_request: # This will publish a site preview on every pull request, and also run the build command to test if the site is broken.

 jobs:
   deploy:
     runs-on: ubuntu-20.04
+    env:
+      PR_PATH: pull/${{github.event.number}}
     steps:
+      - name: Comment on PR
+        uses: hasura/comment-progress@v2.2.0
+        if: github.ref != 'refs/heads/main'
+        with:
+          github-token: ${{ secrets.GITHUB_TOKEN }}
+          repository: ${{ github.repository }}
+          number: ${{ github.event.number }}
+          id: deploy-preview
+          message: "Starting deployment of preview ⏳..."
+
       - name: Set domain
         run: echo "DOMAIN=www.daiyi.co" >> $GITHUB_ENV # TODO set your custom domain
         # If you're using the default github pages url, use this instead:
         # run: echo "DOMAIN=${{ github.actor }}.github.io" >> $GITHUB_ENV

       - name: Checkout website repo
         uses: actions/checkout@v2
         with:
           submodules: true # fetch the theme
           # you need to set this as an environment env if your repo or any submodules (e.g the theme) is private:
           # token: ${{ secrets.PRIVATE_REPO_TOKEN }}

       - name: Setup Hugo
         uses: peaceiris/actions-hugo@v2
         with:
           hugo-version: "0.88.1" # TODO set this to your hugo version

       - name: Set production base URL
         run: echo "BASE_URL=https://${{ env.DOMAIN }}/${{ github.event.repository.name }}/" >> $GITHUB_ENV

       - name: Build website
         run: hugo --baseURL "${{ env.BASE_URL }}"
         env:
           HUGO_ENV: production

-      - name: Deploy
+      - name: Deploy if this is the `main` branch
         uses: peaceiris/actions-gh-pages@v3
+        if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./public
           cname: ${{ env.DOMAIN }} # TODO you need to set this if you're using a custom domain. Otherwise you can remove it.
+
+      - name: Set base URL for preview if PR
+        if: github.ref != 'refs/heads/main'
+        run: echo "BASE_URL=https://${{ env.DOMAIN }}/${{ github.event.repository.name }}/${{ env.PR_PATH}}/" >> $GITHUB_ENV
+
+      - name: Build PR preview website
+        if: github.ref != 'refs/heads/main'
+        run: hugo --baseURL "${{ env.BASE_URL }}"
+        env:
+          HUGO_ENV: staging
+
+      - name: Deploy to PR preview
+        uses: peaceiris/actions-gh-pages@v3
+        if: github.ref != 'refs/heads/main'
+        with:
+          github_token: ${{ secrets.GITHUB_TOKEN }}
+          publish_dir: ./public
+          destination_dir: ${{ env.PR_PATH }} # TODO you need to set this if you're using a custom domain. Otherwise you can remove it.
+
+      - name: Update comment
+        uses: hasura/comment-progress@v2.2.0
+        if: github.ref != 'refs/heads/main'
+        with:
+          github-token: ${{ secrets.GITHUB_TOKEN }}
+          repository: ${{ github.repository }}
+          number: ${{ github.event.number }}
+          id: deploy-preview
+          message: "A preview of ${{ github.event.after }} is uploaded and can be seen here:\n\n ✨ ${{ env.BASE_URL }} ✨\n\nChanges may take a few minutes to propagate. Since this is a preview of production, content with `draft: true` will not be rendered. The source is here: https://github.com/${{ github.repository }}/tree/gh-pages/${{ env.PR_PATH }}/"
```

It's nice to clean up after ourselves, so create a new github action file `.github/workflows/pr-close.yml` that deletes previews when PRs are closed ([source here](https://github.com/daiyi/gh-pages-pr-previews/blob/03d7b5f656d4c5d6ed40dcf4307a1ffa6bae30a7/.github/workflows/pr-close.yml)):

```yml
# .github/workflows/pr-close.yml

name: delete preview on PR close
on:
  pull_request:
    types: [closed]

jobs:
  delete_preview:
    runs-on: ubuntu-20.04
    env:
      PR_PATH: pull/${{github.event.number}}
    steps:
      - name: make empty dir
        run: mkdir public

      - name: delete folder
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          destination_dir: ${{ env.PR_PATH }}

      - name: Comment on PR
        uses: hasura/comment-progress@v2.2.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          repository: ${{ github.repository }}
          number: ${{ github.event.number }}
          id: deploy-preview
          message: "🪓 PR closed, deleted preview at https://github.com/${{ github.repository }}/tree/gh-pages/${{ env.PR_PATH }}/"
```

Let's test this out on a PR :D

```bash
git checkout -b pr-previews
git add .
git commit -m "workflows for PR previews + delete on PR close"
git push --set-upstream origin pr-previews
```

Go to github and open a [pull request](https://github.com/daiyi/gh-pages-pr-previews/pull/1) for that branch. A friendly robot will let you know they're working on your request:

{% figure src="comment-loading.jpg" %}

The comment will update with preview urls once the preview is ready:

{% figure src="comment-ready.jpg" %}

Check out the link in the preview. It should contain a site that is exactly like the site at `main`, since we haven't made changes to it. If everything looks good, merge that PR, upon which the robots will come in and [clean up](https://github.com/daiyi/gh-pages-pr-previews/pull/1#issuecomment-960087228):

{% figure src="comment-delete.jpg" alt="bye" %}

Here's a demo of [an open pull request](https://github.com/daiyi/gh-pages-pr-previews/pull/2) where I add a new blog post:

{% figure src="demo.jpg" %}

The preview for that PR: https://daiyi.github.io/gh-pages-pr-previews/pull/2/.

And the source: https://github.com/daiyi/gh-pages-pr-previews/tree/gh-pages/pull/2/.

Nice! It works!

### Considerations

I haven't thought too hard about if this is too jank for a Serious Website™, but it should be fine for low-key stuff like blogs, portfolios, or documentation.

The preview urls shouldn't interfere with your site unless the `/pull` subdirectory is already occupied with a web page. And the preview pages also won't appear on your production sitemap/rss feeds/other generated indeces since the static site generator doesn't know about it while compiling the production version of the site. If you're worried about that, it may be prudent to use ENV flags to conditionally toggle off production stuff in the PR preview sites, like web crawler indexing (`noindex,nofollow`, `robots.txt`, etc). In my example, I set `HUGO_ENV: production` for `main` and `HUGO_ENV: staging` for PRs. You can look into if your static site generator/theme supports that.

Also I am not compelled to spend the energy to become a workflow configuration language expert and I'm sure it could be written with more elegance, if that is a concept that can be applied to yaml files. Feel free to make a PR and show me how it should be done :D

Let me know if you use this strategy! I found [someone else's](https://github.com/adriangb/gh-pages-docs) attempt at implementing this idea but thought I'd try my own hand at it (and also completing the "delete preview on PR close" feature). I'm curious if someone else out there wants to make PR previews for gh pages for some weird reason \o/
