# Lately.js

A `new Lately()` will deep learn for you a sequence, a sequence of `'strings'`. Feed it a stream of these named events, and Lately will predict for you the probable future events of the stream.

**Table of Contents**

- [Install](#install)
- [Quick start](#quick-start)
- [Testing](#testing)
- [Technology stack](#technology-stack)
- [Versioning](#versioning)
- [Issues](#issues)
- [License](#license)


## Install

First, install with [npm](https://www.npmjs.com/package/lately):

    $ npm install --save lately



## Quick start

    > var lately = require('lately');
    > var l = new lately.Lately();
    > l.feed(['hello', 'world', 'hello']);
    > l.predict()
    {
      'world': 0.7,
      'hello': 0.3
    }


## Testing

First, we need to install development packages:

    $ npm install

After install, run tests by:

    $ npm test

See `package.json` for test suite details.



## Technology stack

- [mathjs](http://mathjs.org/): mathematics

Development tools:

- [ESLint](http://eslint.org/): linting
- [Mocha](https://mochajs.org/): test runner
- [Chai Assert](http://chaijs.com/api/assert/): assertions



## Versioning

On the master branch, we use the [semantic versioning](http://semver.org/) scheme. The semantic version increments are bound to the operations you need to do when upgrading your TresDB instance:

- MAJOR (+1.0.0) denotes a new incompatible feature. A database migration might be required after upgrade. Hyperlinks of earlier versions might not work.
- MINOR (+0.1.0) denotes a new backwards-compatible feature. Upgrading directly from the Git should not break anything.
- PATCH (+0.0.1) denotes a backwards-compatible bug fix. Upgrading or downgrading directly from the Git should not break anything.


## Issues

Report bugs and features to [GitHub issues](https://github.com/axelpale/lately/issues).

The issue labels follow [Drupal's issue priority levels](https://www.drupal.org/core/issue-priority): critical, major, normal, and minor.


## License

MIT
