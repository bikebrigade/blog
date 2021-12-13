{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    buildInputs = [ pkgs.buildPackages.nodejs-16_x nodePackages.npm ];
}