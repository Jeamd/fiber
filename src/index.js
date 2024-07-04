/*******************************************react_fiber***************************************************************/
import React, { render } from "./react_fiber";

const root = document.getElementById("root");

const virtualDOM = (
  <div>
    <div>
      <span>111</span>
      <h2>222</h2>
    </div>
    <img src="avatar.png" className="profile" />
    <span>🐂🍺</span>
    <h3
      onClick={() => {
        console.log("1111");
      }}
    >
      123
    </h3>
  </div>
);

// React.render(virtualDOM, root);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>class component</div>;
  }
}

React.render(<App />, root);

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
