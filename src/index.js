/*******************************************react_fiber***************************************************************/
import React, { render } from "./react_fiber";

const root = document.getElementById("root");

const virtualDOM = (
  <div>
    <div>
      <span>111</span>
      <h2>222</h2>
    </div>
    <span>🐂🍺</span>
  </div>
);

const newVirtualDOM = (
  <div>
    <div>
      <span>222</span>
      {/* <h3>444</h3> */}
    </div>
    <span>111🐂🍺222</span>
  </div>
);

// React.render(virtualDOM, root);

// setTimeout(() => {
//   React.render(newVirtualDOM, root);
// }, 2000);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: "class",
    };
  }

  render() {
    return (
      <div>
        <div>{this.state.class} component</div>
        <button onClick={() => this.setState({ class: "change class" })}>
          class component
        </button>
      </div>
    );
  }
}

React.render(<App />, root);

function FuncApp(props) {
  return <div>{props.title} component</div>;
}

// React.render(<FuncApp title={"function"} />, root);

/*******************************************react***************************************************************/
// import React from "./react";

// const root = document.getElementById("root");

// const Demo = function () {
//   return <span>hello word</span>;
// };

// class Alert extends React.Component {
//   // new 实例时执行
//   constructor(props) {
//     // 调用父类的constructor函数
//     super(props);
//   }
//   render() {
//     return (
//       <div>
//         class component
//         <br />
//         name:<span>{this.props.name}</span>
//         age:<span>{this.props.age}</span>
//       </div>
//     );
//   }
// }

// const Title = function (props) {
//   return (
//     <div>
//       title from function Component
//       <br />
//       <span>{props.title}</span>
//       <br />
//       <Demo />
//     </div>
//   );
// };

// const virtualDOM = (
//   <div>
//     <img src="avatar.png" className="profile" />
//     <span>🐂🍺</span>
//     <h3
//       onClick={() => {
//         console.log("1111");
//       }}
//     >
//       123
//     </h3>
//     {1 == 2 && <div>111</div>}
//     <Title title={"props title"} />
//     <Alert name={"张三"} age={20} />
//   </div>
// );

// const virtualDOM2 = (
//   <div>
//     <img className="profile" />
//     <div>🐂🍺2222</div>
//     <div>22223333</div>
//     <h3
//       onClick={() => {
//         console.log("2222");
//       }}
//     >
//       123
//     </h3>
//     {1 == 2 && <div>111</div>}
//     <Title title={"props title 2"} />
//     <Alert name={"张三 2"} age={20} />
//   </div>
// );

// React.render(virtualDOM, root);

// setTimeout(() => {
//   React.render(virtualDOM2, root);
// }, 2000);

// console.log(virtualDOM);
