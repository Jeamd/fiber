const express = require("express");

const app = express();

app.use(express.static("./dist"));

const template = `
    <html>
        <head>
            <title>react fiber</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="bundle.js"></script>
        </body>
    </html>
`;

app.get("*", (reg, res) => {
  res.send(template);
});

app.listen(3000, () => {
  console.log("app listen 300");
});
