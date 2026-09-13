# Portfolio Content Workflow

## Source of truth

Published portfolio content lives in `src/data/defaultData.js`. Public routes read that committed module through `src/services/contentService.js`. Browser storage cannot change what visitors see.

The committed files in `public/images/` are the current published media assets. Add future media under `public/assets/` using folders for `profile`, `projects`, `certifications`, `resume`, or `general`, then reference the root-relative path from the data file.

## Updating content

1. Edit the relevant collection in `src/data/defaultData.js`.
2. Preserve existing IDs and keep list order intentional.
3. Add or replace media in `public/` and use its root-relative path, such as `/assets/projects/my-project/cover.webp`.
4. Run `npm run validate:content`.
5. Run `npm test`.
6. Run `npm run build`.
7. Review the generated site locally with `npm run preview`.
8. Commit the reviewed source and assets, then push to `main`.
9. GitHub Actions builds and deploys `dist/` to GitHub Pages.

## Collections

- Profile and about copy: `defaultProfile`
- SEO/site metadata: `defaultSettings`
- Expertise groups: `defaultExpertise`
- Skills: `defaultSkills`
- Projects and case studies: `defaultProjects`
- Journey timeline: `defaultJourney`
- Education: `defaultEducation`
- Services: `defaultServices`
- Certifications: `defaultCertifications`

## Admin editor

The `/admin` editor is a local draft utility. Its edits are not published and do not change the public site or another device. Use Settings to export a JSON handoff, then transfer reviewed values into `src/data/defaultData.js` and commit them.

The editor must never receive a GitHub token or a private credential. GitHub publishing happens through a normal local Git commit and the repository's GitHub Actions workflow.

## Commands

```text
npm install
npm run validate:content
npm test
npm run build
npm run preview
```

## Publishing

```text
git add src/data public PORTFOLIO_CONTENT_WORKFLOW.md package.json scripts

git commit -m "Update portfolio content"
git push origin main
```

The workflow in `.github/workflows/deploy.yml` runs `npm ci`, builds the static site, uploads `dist/`, and deploys it to GitHub Pages.

## Storage and privacy

Do not commit `.env`, credentials, browser databases, `node_modules`, or generated `dist/`. Do not store base64 uploads in data modules. Optimize images before committing them and keep the resume and personal media intentionally sized.
