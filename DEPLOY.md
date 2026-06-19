# Deployment guide — Vercel + free custom domain

## Step 1 — push to GitHub

```bash
gh repo create suhas-portfolio --public --source=. --push
# or manually:
git remote add origin https://github.com/Suhas-123-cell/suhas-portfolio.git
git push -u origin main
```

## Step 2 — deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repo `suhas-portfolio`
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**
5. You'll get a live URL like `suhas-portfolio.vercel.app`

## Step 3 — get a free domain (DigitalPlat FreeDomain)

**You do this manually** — signup can't be automated.

1. Go to https://dash.domain.digitalplat.org/ and create an account
2. Click **Register Domain**
3. Suggested names (pick one):
   - `suhas.dpdns.org`
   - `suhaschowdary.us.kg`
   - `suhas-dev.dpdns.org`
   - `suhascodes.us.kg`
   - `suhas.qzz.io`
4. Choose your preferred name + extension and complete registration
5. DigitalPlat will point you to Cloudflare for DNS management

## Step 4 — wire the domain to Vercel

### In Vercel
1. Go to your project → **Settings → Domains**
2. Add your new domain (e.g. `suhas.dpdns.org`)
3. Vercel will show you DNS records to add — copy them:
   - Type: `CNAME` | Name: `@` or `www` | Value: `cname.vercel-dns.com`
   - (or `A` records pointing to Vercel's IPs if CNAME on root isn't supported)

### In Cloudflare (linked from DigitalPlat dashboard)
1. Open your domain's DNS settings in Cloudflare
2. Add the CNAME/A records Vercel gave you
3. Set proxy status to **DNS only** (grey cloud) for the record Vercel needs

### In DigitalPlat dashboard
1. Under nameservers, paste the two Cloudflare nameservers shown in your Cloudflare account:
   - e.g. `alice.ns.cloudflare.com`
   - e.g. `bob.ns.cloudflare.com`
2. Save

## Step 5 — confirm HTTPS

- DNS propagation takes 5–30 minutes (sometimes up to 48h)
- Check status: https://dnschecker.org — search your domain
- Once propagated, Vercel auto-provisions a Let's Encrypt TLS cert
- Visit `https://your-domain` — you should see the boot screen

### If it's still not working after 1 hour
- Verify the CNAME in Cloudflare is pointing to `cname.vercel-dns.com`
- Make sure the Cloudflare nameservers are saved in DigitalPlat
- Check Vercel → Domains — it should show "Valid Configuration"
