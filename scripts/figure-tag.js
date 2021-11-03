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
  let attrString = '{key}="{values}"';
  let alt = "";

  attrs.forEach(function (attr, index) {
    const pair = attr.split("=");
    if (pair[0] === "alt") {
      alt = pair[1];
    }

    attrs[index] = attrString
      .replace(/{key}/g, pair[0])
      .replace(/{values}/g, pair[1]);
  });

  return [attrs, alt];
}

hexo.extend.tag.register(
  "figureMD",
  function (args, body) {
    let html = `
<figure>
    <img {attrs}>
    <figcaption>
    {caption}
    </figcaption>
</figure>`;

    const [attrs, alt] = argsToAttrs(args);
    const attrString = attrs.join(" ");
    const caption = marked(body);

    return html.replace(/{attrs}/g, attrString).replace(/{caption}/g, caption);
  },
  { ends: true }
);

hexo.extend.tag.register(
  "figure",
  function (args, body) {
    let html = `
  <figure>
      <img {attrs}>
      <figcaption>
      {caption}
      </figcaption>
  </figure>`;

    const [attrs, alt] = argsToAttrs(args);
    const attrString = attrs.join(" ");

    return html.replace(/{attrs}/g, attrString).replace(/{caption}/g, alt);
  },
  { ends: false }
);
