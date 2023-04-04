const fs = require("fs");

for (let index = 0; index < 100; index++) {
  fs.writeFile(
    `./metadata/${index}`,
    JSON.stringify(
      {
        image:
          "ipfs://bafybeidx2hmnbpxay3yxsvw35fcet5femq42wzbhbnbrlmjzrkmd24tycu",
        name: `Stellar Odyssey #${index}`,
      },
      null,
      4
    ),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File has been created");
    }
  );
}
