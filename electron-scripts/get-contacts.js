process.on("message", async (message) => {
  process.send([
      {
          firstName: 'Baljinder',
          lastName: 'Singh'
      }
  ]);
});