# Chrome extension for code reviews on GitHub.

Adds the following features:
- Jump between diffs with j/k keys.
- Jump between comments with n/p keys.
- Press z key to view a hierarchical representation of the changed files. Each file in a hierarchy also shows a count of comments.

https://chrome.google.com/webstore/detail/lminappfllpnijhgafphnmcdfbnppmac

## Local development

### Installing development tools
`npm install`

### Running tests
`karma start`

### Building Chrome extension package
`npm script build` - minifies the code and zips all other required assets into extension-dist.zip.

