# lately.js

Predicts future of a multi-channel binary data stream by using bayesian machine learning methods.

**Table of Contents**

- [Install](#install)
- [Quick start](#quick-start)
- [Versioning](#versioning)
- [Issues](#issues)
- [License](#license)


## Install

First, install with [npm](https://www.npmjs.com/package/lately):

    $ npm install --save lately



## Quick start

    > const lately = require('lately');
    > const history = [
      [1, 0, 1],
      [0, 0, 0]
    ]
    > lately.predict(history, 2)
    [
      [0, 1],
      [0, 0]
    ]



## Versioning

On the master branch, we use the [semantic versioning](http://semver.org/) scheme. The semantic version increments are bound to the operations you need to do when upgrading:

- MAJOR (+1.0.0) denotes backwards-incompatibility. API has changed so that code using an earlier version might not work.
- MINOR (+0.1.0) denotes a new feature. Code using an old version should work with the new version, but code using the new might not work with the old.
- PATCH (+0.0.1) denotes a backwards-compatible bug fix. Code using an old version should work with the new and code using the new version should also work with the old.



## Issues

Report bugs and features to [GitHub issues](https://github.com/axelpale/lately/issues).



## License

MIT
