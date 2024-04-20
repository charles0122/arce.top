import React from "react";

function Codepen({ height = 300, title, hash, theme = "dark", ...rest }) {
  return (
    <iframe
      height={height}
      style={{ width: "100%" }}
      scrolling="no"
      title={title}
      src={`https://codepen.io/zxuqian/embed/${hash}?height=${height}&theme-id=${theme}&default-tab=css,result`}
      frameBorder="no"
      loading="lazy"
      allowFullScreen={true}

    >
      See the Pen <a href={`https://codepen.io/zxuqian/pen/${hash}`}>{title}</a>{" "}
      by Charles Lai (<a href="https://codepen.io/zxuqian">@arce</a>) on{" "}
      <a href="https://codepen.io">CodePen</a>.
    </iframe>
  );
}

export default Codepen;
