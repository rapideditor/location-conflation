## Release Checklist

#### Update version, tag, and publish
- [ ] git checkout main
- [ ] git pull origin
- [ ] npm install
- [ ] npm run test
- [ ] Update version number in `package.json`
- [ ] Update CHANGELOG.md
- [ ] git add . && git commit -m 'vA.B.C'
- [ ] git tag vA.B.C
- [ ] git push origin main vA.B.C
- [ ] npm publish
- [ ] Go to GitHub and link the release notes to the changelog


### Purge JSDelivr CDN cache
Include any URLs that iD/Rapid/others might request.

```bash
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation/dist/location-conflation.iife.js'
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation/dist/location-conflation.iife.min.js'
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation@1/dist/location-conflation.iife.js'
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation@1/dist/location-conflation.iife.min.js'
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation@1.2/dist/location-conflation.iife.js'
curl 'https://purge.jsdelivr.net/npm/@rapideditor/location-conflation@1.2/dist/location-conflation.iife.min.js'
```
