{
  description = "raycast-extension-open-link-in-notion";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/release-22.11";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

  outputs = { self, nixpkgs, flake-utils, flake-compat }:
    let
      localOverlay = import ./nix/overlay.nix;
      overlays = [ localOverlay ];
    in
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system overlays;
          };
        in
        {
          legacyPackages = pkgs;
          inherit (pkgs) devShell;
        }) // {
      overlay = final: prev: (nixpkgs.lib.composeManyExtensions overlays) final prev;
      inherit overlays;
    };
}
