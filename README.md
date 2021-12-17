# The Bike Brigade's tech blog  🚲 ⌨️ ✨

Built using:
- [Eleventy](https://www.11ty.dev/)
- [Netlify](https://www.netlify.com/)

## How to contribute

_Running locally_

1. Clone and navigate to folder
1. `nix-shell`
1. `npm start`
1. Write your post in markdown and add to `src/posts`.
1. Open a PR (deploys on merge).

_Deploy previews_

Every PR will have an automatic comment from netlify with a link to a deploy preview for your branch so you can see and share your changes.

_Deploying to production_

Just merge your PR!

### Updating nix dependencies
[niv](https://github.com/nmattia/niv) is used to ensure everyone is using the same version of nixpkgs.
To update the nixpkgs version run:

```
nix-shell -p niv
niv update
```

You can then commit the changes.
