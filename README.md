#know_thyself

Coax Rollup to emit a diagram of your code via Graphviz!

This is my homemade version of [rollup-plugin-graph](https://www.npmjs.com/package/rollup-plugin-graph) and [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer).

Obviously you'll need [Graphviz](https://graphviz.org) to use this:

```
brew install graphviz
```

This project uses Rollup, but as you'll see, that doesn't mean you need to package your code with it. You might also have some luck migrating this solution to some other bundler.

To run this demo, just, you know,

```
npm install
npm run roll_it
```

Take a peek inside of [rollup.config.js](rollup.config.js) to better understand what we're asking Rollup to do. The graphs it outputs are in the `graphs` directory.

## License

Nah I'm kidding.
