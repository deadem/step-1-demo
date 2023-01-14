"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _plugin = require("@parcel/plugin");
const _diagnostic = require("@parcel/diagnostic");
const stylelint = require("stylelint");

var _default = new _plugin.Validator({
  async validate({
    asset
  }) {
    const code = await asset.getCode();
    const report = await stylelint.lint({
      code,
      codeFilename: asset.filePath,
    });

    let validatorResult = {
      warnings: [],
      errors: []
    };

    if (report.errored) {
      for (let result of report.results) {
        const add = (diagnostic) => {
          // console.log(diagnostic);
          validatorResult[result.errorCount > 0 ? 'errors' : 'warnings'].push({
            origin: 'parcel-validator-stylelint',
            ...diagnostic
          });
        }

        result.deprecations.forEach(({ text, reference }) => add({
          message: `${text} (see ${reference})`,
          // filePath: result.source,
        }));

        result.invalidOptionWarnings.forEach(({ text }) => add({
          message: text,
          // filePath: result.source,
        }));

        if (!result.warnings.length) continue;
        // console.log(result);

        let codeframe = {
          filePath: asset.filePath,
          code: result.css,
          codeHighlights: result.warnings.map(message => {
            let start = {
              line: message.line,
              column: message.column
            };
            return {
              start,
              // Parse errors have no ending
              end: message.endLine != null ? {
                line: message.endLine,
                column: message.endColumn
              } : start,
              message: (0, _diagnostic.escapeMarkdown)(message.text)
            };
          })
        };

        add({
          message: `Stylelint found **${result.warnings.length}** __warnings__.`,
          codeFrames: [codeframe]
        });
      }
    }

    return validatorResult;
  }

});

exports.default = _default;
