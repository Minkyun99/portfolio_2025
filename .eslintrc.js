module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    "vue/html-self-closing": [
      "error",
      {
        // HTML 태그 자동 닫기 설정
        html: {
          void: "always", // 단일 태그는 항상 닫음
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // console.log 제한
    "no-unused-vars": "warn", // 미사용 변수 경고로 표시
  },
};
