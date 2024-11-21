// 引入基本模块
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
// 图片模块
import ImageModule from "docxtemplater-image-module-free";
// 解析语法模块
import expressions from "angular-expressions";
import assign from "lodash/assign";
// 文档预览模块
import { renderAsync } from "docx-preview";

expressions.filters.lower = function (input) {
  if (!input) return input;
  return input.toLowerCase();
};

function angularParser(tag) {
  tag = tag
    .replace(/^\.$/, "this")
    .replace(/('|')/g, "'")
    .replace(/("|")/g, '"');
  const expr = expressions.compile(tag);
  return {
    get: function (scope, context) {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = assign(obj, scopeList[i]);
      }
      return expr(scope, obj);
    },
  };
}

// 加载文件
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

// 配置空值替换函数 作为配置参数可配置在setOptions中
function nullGetter(part, scopeManager) {
  if (!part.module) {
    return "-null-";
  }
  if (part.module === "rawxml") {
    return "";
  }
  return "--";
}

/**
 * 预览word,支持图片
 * @param {Object} tempDocxPath 模板文件路径
 * @param {Object} wordData 导出数据
 * @param {Object} fileName 导出文件名
 * @param {Arrsy} imgSize 自定义图片尺寸
 */
export const getWordImage = (tempDocxPath, wordData, imgSize, file) => {
  // 本地word.docx文件需要放在public目录下
  loadFile(tempDocxPath, (error, content) => {
    if (error) {
      throw error;
    }

    // 图片配置
    const imageOpts = {
      getImage: function (tagValue, tagName) {
        return new Promise(function (resolve, reject) {
          PizZipUtils.getBinaryContent(tagValue, function (error, content) {
            if (error) {
              return reject(error);
            }
            return resolve(content);
          });
        });
      },
      getSize: function (img, tagValue, tagName) {
        const size = imgSize[tagName] ? imgSize[tagName] : [150, 150];
        return size;
      },
    };

    let imageModule = new ImageModule(imageOpts);

    const zip = new PizZip(content);

    // 实例化有两种方式 这里是链式
    const doc = new Docxtemplater()
      .loadZip(zip)
      .setOptions({
        // delimiters: { start: "[[", end: "]]" },
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: nullGetter,
        parser: angularParser,
      })
      .attachModule(imageModule)
      .compile();

    doc.renderAsync(wordData).then(() => {
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      renderAsync(out, file);
    });
  });
};



/**
 * 导出word,不支持图片
 * @param {Object} tempDocxPath 模板文件路径
 * @param {Object} wordData 导出数据
 * @param {Object} fileName 导出文件名
 */
export const exportWord = (tempDocxPath, wordData, fileName) => {
  // 本地word.docx文件需要放在public目录下
  loadFile(tempDocxPath, (error, content) => {
    if (error) {
      throw error;
    }
    const zip = new PizZip(content);
    // 没有配置解析语法，深层次对象语法（obj.xx.xx）不可识别
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(wordData);

    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    // Output the document using Data-URI
    saveAs(out, `${fileName}.docx`);
  });
}

/**
 * 导出word,支持图片
 * @param {Object} tempDocxPath 模板文件路径
 * @param {Object} wordData 导出数据
 * @param {Object} fileName 导出文件名
 * @param {Arrsy} imgSize 自定义图片尺寸
 */
export const exportWordImage = (tempDocxPath, wordData, fileName, imgSize) => {
  // 本地word.docx文件需要放在public目录下
  loadFile(tempDocxPath, (error, content) => {
    if (error) {
      throw error;
    }

    // 图片配置
    const imageOpts = {
      getImage: function (tagValue, tagName) {
        return new Promise(function (resolve, reject) {
          PizZipUtils.getBinaryContent(tagValue, function (error, content) {
            if (error) {
              return reject(error);
            }
            return resolve(content);
          });
        });
      },
      getSize: function (img, tagValue, tagName) {
        const size = imgSize[tagName] ? imgSize[tagName] : [150, 150]
        return size;
      },
    };

    let imageModule = new ImageModule(imageOpts);

    const zip = new PizZip(content);

    // 实例化有两种方式 这里是链式
    const doc = new Docxtemplater()
      .loadZip(zip)
      .setOptions({
        // delimiters: { start: "[[", end: "]]" },
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: nullGetter,
        parser: angularParser,
      })
      .attachModule(imageModule)
      .compile();

    doc.renderAsync(wordData).then(function () {
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(out, `${fileName}.docx`);
    });
  });
}
