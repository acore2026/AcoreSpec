# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

### pnpm

```bash
pnpm add -g https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

### yarn

```bash
yarn global add https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

### bun

Bun can install OpenSpec globally, but OpenSpec currently runs on Node.js.
You still need Node.js 20.19.0 or higher available on `PATH`.

```bash
bun add -g https://github.com/acore2026/AcoreSpec/archive/refs/heads/main.tar.gz
```

## Nix

Run OpenSpec directly without installation:

```bash
nix run github:acore2026/AcoreSpec -- init
```

Or install to your profile:

```bash
nix profile install github:acore2026/AcoreSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:acore2026/AcoreSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
openspec --version
```

## Next Steps

After installing, initialize OpenSpec in your project:

```bash
cd your-project
openspec init
```

See [Getting Started](getting-started.md) for a full walkthrough.
