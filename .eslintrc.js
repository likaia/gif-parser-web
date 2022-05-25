module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  plugins: [
    // 用到的插件
    "@typescript-eslint",
    "prettier"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "error", // prettier标记的地方抛出错误信息
    "spaced-comment": [2, "always"], // 注释后面必须写两个空格
    "@typescript-eslint/no-explicit-any": ["off"], // 关闭any校验
    "no-constant-condition": "off", // 允许常量作为语句的表达式
    "no-case-declarations": "off" // 允许在case块内声明变量
  }
};
