import re

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Desktop Theme Toggle insertion
desktop_search = r'(<div\s+id="auth-desktop"\s+class="ml-4\s+flex\s+items-center">)'
desktop_repl = r'''<!-- Theme Toggle -->
                    <button class="theme-toggle-btn text-gray-500 hover:text-amber-500 transition focus:outline-none ml-2" aria-label="Toggle Theme">
                        <i data-lucide="moon" class="w-5 h-5 hidden dark-icon"></i>
                        <i data-lucide="sun" class="w-5 h-5 light-icon"></i>
                    </button>
                    \1'''
html = re.sub(desktop_search, desktop_repl, html, count=1)

# Mobile Theme Toggle insertion
mobile_search = r'(<!-- INTEGRATED: Auth Login/Logout in Mobile Menu -->\s*<div class="border-t border-gray-700 pt-4 pb-3">)'
mobile_repl = r'''<!-- Theme Toggle Mobile -->
                <button class="theme-toggle-btn w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-bold text-gray-400 hover:bg-dark-card hover:text-amber-500 flex items-center gap-2">
                    <i data-lucide="moon" class="w-5 h-5 hidden dark-icon"></i>
                    <i data-lucide="sun" class="w-5 h-5 light-icon"></i>
                    <span>Toggle Theme</span>
                </button>
                \1'''
html = re.sub(mobile_search, mobile_repl, html, count=1)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Theme toggles added.")
