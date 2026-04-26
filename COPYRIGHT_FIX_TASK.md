# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Copyright – mindig látható legyen a SettingsScreen-ben

## Probléma
A copyright blokk jelenleg a kijelentkezés gomb UTÁN van, így csak
bejelentkezett felhasználóknak jelenik meg. Vendég módban nem látszik.

## Javítás – src/screens/SettingsScreen.jsx

A copyright blokkot **mozgasd ki** a `{user && (...)}` feltételből,
és tedd a `</main>` tag ELÉ, mindig látható pozícióba:

```jsx
        {/* Kijelentkezés – csak bejelentkezett usernek */}
        {user && (
          <div className="pt-2">
            <button onClick={handleSignOut} disabled={authBusy}
              className="w-full bg-primary/5 text-primary font-headline font-bold py-4 rounded-3xl border border-primary/10 flex items-center justify-center gap-2 active:bg-primary active:text-on-primary transition-all duration-200 disabled:opacity-60">
              <span className="material-symbols-outlined">logout</span>
              {authBusy ? 'Kijelentkezés…' : 'Kijelentkezés'}
            </button>
          </div>
        )}

        {/* Copyright – MINDIG látható */}
        <div className="text-center pt-2 pb-2 space-y-1">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-headline font-bold opacity-40">
            Választási Bingó 2026 v2.0.0
          </p>
          <a
            href="https://gaiagent.cc/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] text-on-surface-variant font-body opacity-40 hover:opacity-70 transition-opacity"
          >
            © 2026 Gai Agent TechServices · gaiagent.cc
          </a>
        </div>

      </main>
```

## Lépések
1. `src/screens/SettingsScreen.jsx` – copyright blokk kiemelése a user feltételből
2. `npm run build` – 0 hiba
3. `git add src/screens/SettingsScreen.jsx`
4. `git commit -m "fix: copyright mindig látható, nem csak bejelentkezett usernek"`
5. `git push origin main`

## Siker kritériumok
- [ ] Copyright látszik vendég módban is
- [ ] Copyright látszik bejelentkezett usernek is
- [ ] gaiagent.cc link kattintható, új fülön nyílik
- [ ] `npm run build` 0 hiba
