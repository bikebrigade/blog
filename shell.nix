{ sources ? import ./nix/sources.nix { }, pkgs ? import sources.nixpkgs { } }:
  pkgs.mkShell {
    buildInputs = [ pkgs.buildPackages.nodejs-16_x pkgs.nodePackages.npm];
}