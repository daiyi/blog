/** Usage
{% figure src="dog-van-sit.jpeg" %}
Have you ever seen a van sitting so nicely?
{% endfigure %} 
*/

"use strict";

var marked = require("marked");

function argsToAttrs(attrs) {
  var attrString = '{key}="{values}"';

  attrs.forEach(function (attr, index) {
    var pair = attr.split("=");

    attrs[index] = attrString
      .replace(/{key}/g, pair[0])
      .replace(/{values}/g, pair[1]);
  });

  return attrs.join(" ");
}

hexo.extend.tag.register(
  "figure",
  function (args, body) {
    let caption = marked(body),
      attrs = "",
      html = `
<figure>
    <img {attrs}>
    <figcaption>
    {caption}
    </figcaption>
</figure>`;

    attrs = argsToAttrs(args);

    return html.replace(/{attrs}/g, attrs).replace(/{caption}/g, caption);
  },
  { ends: true }
);
