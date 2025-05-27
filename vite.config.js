// vite.config.js
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [glsl()],
  build: {
    cssCodeSplit: true, // 是否提取所有CSS到一个CSS文件中, introduct: https://cn.vitejs.dev/config/build-options.html#build-csscodesplit
  },
});
