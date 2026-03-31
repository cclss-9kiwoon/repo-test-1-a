# Project Rules

## Repository
- Repo: `cclss-9kiwoon/repo-test-1-a`
- Monorepo with multiple branches, each a separate project
- GitHub Pages: `https://cclss-9kiwoon.github.io/repo-test-1-a/`

## Deployment (GitHub Pages)

Each branch deploys independently to its own subfolder on GitHub Pages.
Deploy URL pattern: `https://cclss-9kiwoon.github.io/repo-test-1-a/{slug}/`

### When the user asks to create a deploy/test URL

Automatically create these 2 files:

#### 1. `.deploy.json` (project root)

```json
{
  "slug": "<project-name-in-kebab-case>",
  "type": "static|vite",
  "description": "<short project description>"
}
```

- **slug**: Auto-generate from project name as kebab-case (e.g., "Dwarf Bunny" → `dwarf-bunny`)
- **type**: `"static"` if no build step (vanilla JS/HTML), `"vite"` if has package.json with vite
- Must be unique across all branches

#### 2. `.github/workflows/deploy-branch.yml`

```yaml
name: Deploy Branch

on:
  push:
    branches-ignore: [main, gh-pages]
    paths-ignore: ['**.md']
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Read deploy config
        id: config
        run: |
          if [ ! -f .deploy.json ]; then
            echo "skip=true" >> $GITHUB_OUTPUT
            echo "No .deploy.json found, skipping deploy"
            exit 0
          fi
          echo "skip=false" >> $GITHUB_OUTPUT
          echo "slug=$(jq -r .slug .deploy.json)" >> $GITHUB_OUTPUT
          echo "type=$(jq -r .type .deploy.json)" >> $GITHUB_OUTPUT

      - name: Setup Node.js
        if: steps.config.outputs.skip == 'false' && steps.config.outputs.type == 'vite'
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Build Vite project
        if: steps.config.outputs.skip == 'false' && steps.config.outputs.type == 'vite'
        run: |
          npm install
          npm run build

      - name: Deploy static files
        if: steps.config.outputs.skip == 'false' && steps.config.outputs.type == 'static'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          destination_dir: ${{ steps.config.outputs.slug }}
          keep_files: true
          exclude_assets: '.github,.git,.deploy.json,node_modules'

      - name: Deploy Vite build
        if: steps.config.outputs.skip == 'false' && steps.config.outputs.type == 'vite'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: ${{ steps.config.outputs.slug }}
          keep_files: true
```

### After creating the files
- Commit both files and push to the current branch
- Tell the user their deploy URL: `https://cclss-9kiwoon.github.io/repo-test-1-a/{slug}/`
- The GitHub Action will auto-deploy on push

### CRITICAL: Never use `actions/deploy-pages@v4`
It force-pushes to gh-pages and **deletes all other branch deployments**.
Always use `peaceiris/actions-gh-pages@v4` with `keep_files: true`.
