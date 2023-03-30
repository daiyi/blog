/** Usage
 
1) markdown caption:

{% figureMD src="dog-van-sit.jpeg" %}
Have you ever seen a van sitting so nicely?
{% endfigureMD %} 

2) txt caption:

{% figure src="dog-van-sit.jpeg" alt="Have you ever seen a van sitting so nicely?" %}

*/

"use strict";

const marked = require("marked");

function argsToAttrs(attrs) {
  let alt = "";
  let caption = "";
  const imgAttrs = [];

  attrs.forEach(function (attr) {
    const [key, value] = attr.split("=");
    if (key === "alt") {
      alt = value;
    } else if (key === "caption") {
      caption = value;
    } else {
      imgAttrs.push(attr);
    }
  });

  if (!alt) {
    if (caption) {
      alt = caption;
    } else {
      alt = "photo";
    }
  }
  imgAttrs.push(`alt="${alt.replace(/"/g, "'")}"`);

  return [imgAttrs, caption];
}

hexo.extend.tag.register(
  "figureMD",
  function (args, body) {
    const [imgAttrs] = argsToAttrs(args);
    const caption = marked(body);

    return `
<figure>
    <img ${imgAttrs.join(" ")}>
    <figcaption>
    ${caption}
    </figcaption>
</figure>`;
  },
  { ends: true }
);

hexo.extend.tag.register(
  "figure",
  function (args) {
    const [imgAttrs, caption] = argsToAttrs(args);

    return `
<figure>
    <img ${imgAttrs.join(" ")}>
    <figcaption>
    ${caption}
    </figcaption>
</figure>`;
  },
  { ends: false }
);
