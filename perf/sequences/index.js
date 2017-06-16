var fs = require('fs');
var glob = require('glob');
var path = require('path');
var parse = require('csv-parse');
var async = require('async');

// Location of the sequence csv files.
var ROOT_DIR = __dirname;


var _load = function (seqFilePath, callback) {
  // Parameters:
  //   seqFilePath
  //     absolute file path
  //   callback
  //     function (err, seq)
  //       err
  //       seq
  //         array of sequence items

  // Read file
  fs.readFile(seqFilePath, function (fsErr, seqFileData) {
    if (fsErr) {
      return callback(fsErr);
    }

    // Parse file as CSV
    parse(seqFileData, {
      comment: '#',
      skip_empty_lines: true,
      trim: true,
    }, function (parseErr, rows) {
      if (parseErr) {
        return callback(parseErr);
      }

      // Flatten rows to a single array and return
      var seq = [].concat.apply([], rows);
      return callback(null, seq);
    });
  });

};


exports.load = function (seqName, callback) {
  // Parameters:
  //   seqName
  //     string, basename of the file without extension
  //   callback
  //     function (err, seq)
  //       err
  //       seq
  //         array of sequence items

  // Form abs file path.
  var seqFilePath = path.join(__dirname, seqName + '.csv');

  return _load(seqFilePath, callback);
};


exports.loadAll = function (callback) {
  // Parameters
  //   callback
  //     function (err, seqs)
  //       err
  //       seqs
  //         an array of sequence objects with keys:
  //           name
  //             string
  //           values
  //             array
  glob('*.csv', {
    absolute: true,  // return absolute file paths instead of mere names
    cwd: ROOT_DIR,
  }, function (err, seqFilePaths) {
    if (err) {
      return callback(err);
    }

    // For each found filepath
    async.map(seqFilePaths, function (seqFilePath, done) {

      // Read file
      fs.readFile(seqFilePath, function (fsErr, seqFileData) {
        if (fsErr) {
          return done(fsErr);
        }

        // Parse file as CSV
        parse(seqFileData, { trim: true }, function (parseErr, rows) {
          if (parseErr) {
            return done(parseErr);
          }

          // Flatten rows to a single array
          var seq = [].concat.apply([], rows);

          // Name of the sequence is the name of the file.
          var name = path.basename(seqFilePath, path.extname(seqFilePath));

          // Sequence read
          return done(null, {
            name: name,
            values: seq,
          });
        });
      });

    }, function (mapErr, seqs) {
      if (mapErr) {
        return callback(mapErr);
      }
      return callback(null, seqs);
    });

  });
};
