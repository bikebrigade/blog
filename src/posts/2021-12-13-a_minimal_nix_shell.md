---
title: A gentle introduction to Nix
description: A few lines of code, and a very gentle introduction to a very complicated package manager
author: jennablumenthal
date: 2021-12-13
tags:
  - posts
layout: layouts/post.njk
---

[Nix](https://nixos.org/) is a package manager and system configuration tool that makes it easy to create a consistent developer environment. It helps with the type of "but it works on my machine!" problem, and is also nice for creating a sandbox for trying new things without potentially mucking up your current system's configurations.

Bike Brigade's [dispatching software](https://github.com/bikebrigade/dispatch) already has Nix set up, but I wanted to try setting it up for an existing project (this blog!) from scratch. Here is a quick rundown of what I did.

1. Download Nix

(Okay, I already had it installed but for the purposes of a good narrative let's start from the beginning).

```bash
# Mac instructions
$ sh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume --daemon
```

More install options here: [https://nixos.org/guides/install-nix.html](https://nixos.org/guides/install-nix.html)

2. Create a `shell.nix` file

```bash
$ touch `shell.nix`
```

I found it surprisingly difficult to dig up a basic no-frills example of what a `shell.nix` file should contain. Though, eventually I watched the [demo video](https://nixos.org/#asciinema-demo-cover) from Nix's homepage which I'm basically writing out in non-video form here.

```bash
{ pkgs ? import <nixpkgs> {} }:
# Nixpkgs is a repository of software packages (hosted on Github) that can be installed with the Nix package manager.

  pkgs.mkShell {
    # specify which packages to add to the shell environment

    buildInputs = [
      pkgs.buildPackages.nodejs-16_x
      # NodeJS, above version 16 please!
    ]
}
```

You can search for the packages you would like to be available in your development environment [here](https://search.nixos.org/packages) (try, for example, "nodejs").

3. Enter the Nix development environment with the command  `nix-shell`

Now, you can verify that the version available is as expected (v16.9.1 at the time of writing).

```bash
$ `node -v`
=> v16.9.1
```