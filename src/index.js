import React from "./react";

const root = document.getElementById("root");

const Demo = function () {
  return <span>hello word</span>;
};

class Alert extends React.Component {
  render() {
    return <div>class component</div>;
  }
}

const Title = function (props) {
  return (
    <div>
      title from function Component
      <br />
      <span>{props?.title}</span>
      <br />
      <Demo />
    </div>
  );
};

const virtualDOM = (
  <div>
    <img src="avatar.png" className="profile" />
    <div>🐂🍺</div>
    <h3
      onClick={() => {
        console.log("1111");
      }}
    >
      123
    </h3>
    {1 == 2 && <div>111</div>}
    <Title title={"props title"} />
    <Alert />
  </div>
);

React.render(virtualDOM, root);

console.log(virtualDOM);
