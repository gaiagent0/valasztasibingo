# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Facebook OAuth scope fix

## Probléma
A Facebook login URL-ben `scope=email+email+public_profile` szerepel.
A Supabase automatikusan hozzáadja az `email` scope-ot, ezért ha mi is
megadjuk, duplán kerül bele → Facebook hibát dob.

## Javítás – src/lib/auth.js

Cseréld le a teljes fájlt erre:

```js
import { supabase } from './supabase'

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://valasztasibingo.hu' }
  })

export const signInAnonymously = () =>
  supabase.auth.signInAnonymously()

export const signOut = () => supabase.auth.signOut()

export const signInWithFacebook = () =>
  supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: 'https://valasztasibingo.hu',
      // NE adj meg scopes-t – a Supabase alapból public_profile + email-t küld
    }
  })
```

## Lépések
1. Módosítsd a fájlt
2. `npm run build` – 0 hiba
3. `git add src/lib/auth.js && git commit -m "fix: facebook oauth scope removed, google redirectTo fix" && git push origin main`
