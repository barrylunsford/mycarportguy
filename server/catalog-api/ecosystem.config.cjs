module.exports = {
  apps: [
    {
      name: "mycarportguy-catalog",
      script: "/root/mycarportguy-catalog/start.sh",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3100",
        CATALOG_PRODUCTS_FILE: "/root/mycarportguy-data/products.json",
      },
    },
  ],
};
