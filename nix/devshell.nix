{ mkShell
, nodejs-18_x
}:

mkShell rec {
  name = "dev";

  packages = [
    nodejs-18_x
  ];
}
